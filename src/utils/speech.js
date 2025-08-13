// 语音权限和语音识别相关 util
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

/**
 * 主动请求麦克风权限（Web/安卓）
 * 安卓App优先用原生插件，Web端用getUserMedia
 */
export async function requestMicrophonePermission() {
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isCapacitor) {
        // 安卓App用原生插件，直接尝试 start，异常时提示
        try {
            // 直接用 start 触发权限弹窗
            await SpeechRecognition.start({
                language: 'zh-CN',
                maxResults: 1,
                prompt: '请开始说话',
                partialResults: false,
                popup: true
            });
            return true;
        } catch (err) {
            alert('麦克风权限被拒绝或不可用，请在系统设置中开启权限');
            console.warn('麦克风权限申请失败:', err);
            return false;
        }
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Web端
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (err) {
            alert('麦克风权限被拒绝或不可用，请在系统设置中开启权限');
            console.warn('麦克风权限申请失败:', err);
            return false;
        }
    } else {
        alert('当前环境不支持Web语音识别，请集成原生语音识别插件');
        return false;
    }
}

/**
 * 语音转文字（安卓App/浏览器自动区分）
 * 返回 Promise<string|null>
 */
export async function recognizeSpeech() {
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isCapacitor) {
        try {
            const result = await SpeechRecognition.start({
                language: 'zh-CN',
                maxResults: 1,
                prompt: '请开始说话',
                partialResults: false,
                popup: true
            });
            if (result && result.matches && result.matches.length > 0) {
                return result.matches[0];
            } else {
                alert('未识别到语音内容');
                return null;
            }
        } catch (e) {
            alert('语音识别出错或麦克风权限被拒绝，请在系统设置中开启权限');
            return null;
        }
    } else if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        // Web端
        return new Promise((resolve, reject) => {
            const SpeechRecognitionWeb = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recog = new SpeechRecognitionWeb();
            recog.lang = 'zh-CN';
            recog.continuous = false;
            recog.interimResults = false;
            recog.onresult = (e) => {
                const txt = Array.from(e.results).map(r => r[0].transcript).join('');
                resolve(txt);
            };
            recog.onerror = (e) => {
                alert('语音识别出错：' + e.error);
                reject(e);
            };
            recog.onend = () => { };
            recog.start();
        });
    } else {
        alert('当前浏览器不支持语音识别');
        return null;
    }
}
