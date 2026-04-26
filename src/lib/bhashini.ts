const BHASHINI_USER_ID = process.env.NEXT_PUBLIC_BHASHINI_USER_ID;
const BHASHINI_API_KEY = process.env.NEXT_PUBLIC_BHASHINI_API_KEY;
const BHASHINI_PIPELINE_ID = process.env.NEXT_PUBLIC_BHASHINI_PIPELINE_ID || "64392f0ed77372001301709a"; // Standard ULCA pipeline

interface BhashiniConfig {
  taskType: "asr" | "translation" | "tts";
  sourceLanguage?: string;
  targetLanguage?: string;
}

export async function getBhashiniConfig(tasks: BhashiniConfig[]) {
  const response = await fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "userID": BHASHINI_USER_ID || "",
      "ulcaApiKey": BHASHINI_API_KEY || "",
    },
    body: JSON.stringify({
      pipelineTasks: tasks.map(task => ({
        taskType: task.taskType,
        config: {
          language: {
            sourceLanguage: task.sourceLanguage,
            targetLanguage: task.targetLanguage,
          }
        }
      })),
      pipelineId: BHASHINI_PIPELINE_ID
    })
  });

  return await response.json();
}

export async function bhashiniTranslate(text: string, sourceLang: string, targetLang: string) {
  try {
    const pipelineData = await getBhashiniConfig([{ taskType: "translation", sourceLanguage: sourceLang, targetLanguage: targetLang }]);
    
    const translationTask = pipelineData.pipelineResponseConfig.find((t: any) => t.taskType === "translation");
    const serviceId = translationTask.config[0].serviceId;
    const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint.callbackUrl;
    const inferenceKey = pipelineData.pipelineInferenceAPIEndPoint.inferenceApiKey.value;

    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": inferenceKey
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: "translation",
          config: {
            language: { sourceLanguage: sourceLang, targetLanguage: targetLang },
            serviceId
          }
        }],
        inputData: { input: [{ source: text }] }
      })
    });

    const result = await response.json();
    return result.pipelineResponse[0].output[0].target;
  } catch (error) {
    console.error("Bhashini Translation Error:", error);
    return text;
  }
}

export async function bhashiniTTS(text: string, lang: string, gender: "male" | "female" = "female") {
  try {
    const pipelineData = await getBhashiniConfig([{ taskType: "tts", sourceLanguage: lang }]);
    
    const ttsTask = pipelineData.pipelineResponseConfig.find((t: any) => t.taskType === "tts");
    const serviceId = ttsTask.config[0].serviceId;
    const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint.callbackUrl;
    const inferenceKey = pipelineData.pipelineInferenceAPIEndPoint.inferenceApiKey.value;

    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": inferenceKey
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: "tts",
          config: {
            language: { sourceLanguage: lang },
            serviceId,
            gender
          }
        }],
        inputData: { input: [{ source: text }] }
      })
    });

    const result = await response.json();
    const audioContent = result.pipelineResponse[0].audio[0].audioContent;
    return `data:audio/wav;base64,${audioContent}`;
  } catch (error) {
    console.error("Bhashini TTS Error:", error);
    return null;
  }
}

export async function bhashiniASR(audioBase64: string, lang: string) {
  try {
    const pipelineData = await getBhashiniConfig([{ taskType: "asr", sourceLanguage: lang }]);
    
    const asrTask = pipelineData.pipelineResponseConfig.find((t: any) => t.taskType === "asr");
    const serviceId = asrTask.config[0].serviceId;
    const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint.callbackUrl;
    const inferenceKey = pipelineData.pipelineInferenceAPIEndPoint.inferenceApiKey.value;

    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": inferenceKey
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: "asr",
          config: {
            language: { sourceLanguage: lang },
            serviceId,
            audioFormat: "wav",
            samplingRate: 16000
          }
        }],
        inputData: { audio: [{ audioContent: audioBase64 }] }
      })
    });

    const result = await response.json();
    return result.pipelineResponse[0].output[0].source;
  } catch (error) {
    console.error("Bhashini ASR Error:", error);
    return "";
  }
}
