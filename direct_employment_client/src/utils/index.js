/**
 * 包含n个工具函数的模块
 */
/**
 * 根据type和header来决定跳转的目标路径
 * @param type 用户类型
 * @param header 是否拥有头像
 * @returns {string} 目标路径
 */
export function getRedirectTo(type, header) {
    // 目标路径
    var targetPath = '' ;

    if (type === 'boss') {
        // 用户类型是boss，则目标路径是/boss，boss的主界面
        targetPath = '/boss' ;
    } else if (type === 'jobhunter') {
        // 用户类型是jobhunter，则目标路径是/jobhunter，jobhunter的主界面
        targetPath = '/jobhunter' ;
    }

    if (!header) {
        // 如果头像不存在，则跳转到信息完善界面
        targetPath = targetPath + 'info' ;
    }

    return targetPath ;
}