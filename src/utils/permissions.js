// src/utils/permissions.js
import { Camera } from '@capacitor/camera'

/**
 * 主动请求相册/相机权限（安卓/iOS）
 */
export async function requestCameraPermission() {
    await Camera.requestPermissions()
}

/**
 * 主动请求麦克风权限（Web/安卓）
 */
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

/**
 * 主动请求麦克风权限（Web/安卓）
 * 安卓App优先用原生插件，Web端用getUserMedia
 */
export async function requestMicrophonePermission() {
    // 判断是否为安卓App环境（Capacitor）
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (isCapacitor) {
        // 安卓App用原生插件
        try {
            const perm = await SpeechRecognition.hasPermission();
            if (!perm.permission) {
                const req = await SpeechRecognition.requestPermission();
                if (!req.permission) {
                    alert('麦克风权限被拒绝或不可用，请在系统设置中开启权限');
                    return false;
                }
            }
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
 * 一次性请求相机和麦克风权限
 */
export async function requestAllMediaPermissions() {
    await requestCameraPermission()
    await requestMicrophonePermission()
}

