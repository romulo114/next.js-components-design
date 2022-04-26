import { getApiKey, getBaseURL, getHistory, saveHistory } from "./storage";
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
    const response = await client.post('/api/scan/url', { url });

    const { flow_id } = response;
    if (!flow_id) throw Error('Invalid flow id');

    const name = url.substring(url.lastIndexOf('/') + 1);
    notify(`Scan started for ${name}`, 5000);

    const params = 'filter=finalVerdict&filter=general&filter=taskReference&filter=overallState&filter=subtaskReferences&sorting=allSignalGroups%28description%3Aasc%2CaverageSignalStrength%3Adesc%29&sorting=allTags%28tag.name%3Aasc%29'
    while (true) {
      const result = await client.get(`/api/scan/${flow_id}/report`, params);
      const scans = parseReport(baseUrl, flow_id, result);

      try {
        if (scans) {
          if (isAllFinished(scans) && scans.length > 0) {
            const history = await getHistory();
            await saveHistory([...history, ...scans]);

            notify(`Scan completed: ${getVerdict(scans)}`, 5000);

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
  } catch (e) {
    console.log(e);
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
