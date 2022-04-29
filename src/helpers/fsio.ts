import { getApiKey, getBaseURL, getHistory, getMaxFileSize, getScanDownload, saveHistory } from "./storage";
import { HttpClient } from './service';
import { notify } from "./notification";
import { ScanInfo } from "../types";

const verdicts = ['malicious', 'likely_malicious', 'suspicious', 'informational', 'benign', 'unknown'];
const finishedStates = ['success_partial', 'success', 'failed', 'failed_partial'];
const successStates = ['success_partial', 'success'];
const failedStates = ['failed_partial', 'failed'];
export function isFinished(status: string) {
  return finishedStates.includes(status);
}

function isAllFinished(infos: ScanInfo[]) {
  for (const info of infos) {
    if (!isFinished(info.status)) {
      return false;
    }
  }

  return true;
}

export function isSucceed(status: string): boolean {
  return successStates.includes(status);
}

export function isFailed(status: string): boolean {
  return failedStates.includes(status);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function buildLink(baseUrl: string, flowId: string, reportId: string) {
  return `${baseUrl}/uploads/${flowId}/reports/${reportId}`;
}

export async function scanLink(url: string) {
  try {
    const apiKey = await getApiKey();
    const baseUrl = await getBaseURL();

    const client = new HttpClient(baseUrl, apiKey);
    const name = url.substring(url.lastIndexOf('/') + 1);
    notify(`Scan started for ${name}`, 5000);
    const response = await client.post('/api/scan/url', { url });

    const { flow_id } = response;
    if (!flow_id) throw Error('Invalid flow id');

    await waitForComplete(client, baseUrl, flow_id);
  } catch (e) {
    console.log(e);
  }
}

export async function scanFile(file: File) {
  try {
    const apiKey = await getApiKey();
    const baseUrl = await getBaseURL();
    const enable = (await getScanDownload()) ?? false
    const sizeLmt = (await getMaxFileSize()) ?? 0;

    if (!enable) return;
    if (sizeLmt > 0 && file.size > sizeLmt) {
      notify(`File is too large(Limit: ${sizeLmt})`, 5000);
      return;
    }

    const client = new HttpClient(baseUrl, apiKey);
    const formData = new FormData();
    formData.append('file', file, file.name);
    const name = file.name;
    notify(`Scan started for ${name}`, 5000);

    const response = await client.postForm('/api/scan/file', formData);
    const { flow_id } = response;
    if (!flow_id) throw Error('Invalid flow id');

    await waitForComplete(client, baseUrl, flow_id);
  } catch (e) {
    console.log(e);
  }
}

async function waitForComplete(client: HttpClient, baseUrl: string, flowId: string) {
  const params = 'filter=finalVerdict&filter=general&filter=taskReference&filter=overallState&filter=subtaskReferences&sorting=allSignalGroups%28description%3Aasc%2CaverageSignalStrength%3Adesc%29&sorting=allTags%28tag.name%3Aasc%29'
  while (true) {
    const result = await client.get(`/api/scan/${flowId}/report`, params);
    const scans = parseReport(baseUrl, flowId, result);

    try {
      if (scans) {
        if (isAllFinished(scans) && scans.length > 0) {
          const history = await getHistory();
          await saveHistory([...history, ...scans]);

          const verdict = getVerdict(scans);

          notify(`Scan completed: ${verdict}`, 5000, `/images/icon-48${getIconForVerdict(verdict)}.png`);

          chrome.runtime.sendMessage({ type: 'scanning', finished: true, scans });
          break;
        } else {
          chrome.runtime.sendMessage({ type: 'scanning', scans });
        }
      }
    } catch (e) {
      console.log(e);

      notify(`Error occured during scanning: ${e}`, 5000);

      break;
    }

    await sleep(1000);
  }
}

function parseReport(baseUrl: string, flowId: string, response: any): ScanInfo[] | null {
  const reports = response.reports
  if (!reports) return null

  const result = Object.keys(reports).map(id => {
    const report = reports[id]
    return {
      flowId,
      reportId: id,
      link: buildLink(baseUrl, flowId, id),
      created: report.created_date,
      name: report.file?.name,
      hash: report.file?.hash,
      verdict: report.finalVerdict?.verdict?.toLowerCase(),
      status: report.overallState
    }
  })

  return result
}

function getVerdict(scans: ScanInfo[]) {
  let minIdx = verdicts.length - 1;
  for (const scan of scans) {
    const idx = verdicts.indexOf(scan.verdict);
    if (idx < minIdx) minIdx = idx;
  }

  return verdicts[minIdx];
}

function getIconForVerdict(verdict: string): string {
  if (verdict === 'malicious') return 'm';
  else if (verdict === 'likely_malicious') return 'lm';
  else if (verdict === 'suspicious') return 's';
  else return '';
}
