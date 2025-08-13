import { Camera } from '@capacitor/camera'

/**
 * 主动请求相册/相机权限（安卓/iOS）
 */
export async function requestCameraPermission() {
    try {
        await Camera.requestPermissions();
        return true;
    } catch (e) {
        //alert('相机权限被拒绝或不可用，请在系统设置中开启权限');
        return false;
    }
}