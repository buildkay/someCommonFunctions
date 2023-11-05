const fsm = uni.getFileSystemManager(); // 获取文件系统管理器对象
const FILE_BASE_NAME = "tmp_base64src"; // 自定义文件名前缀

function base64src(base64data, cb) {
  const [, format, bodyData] =
    /data:image\/(\w+);base64,(.*)/.exec(base64data) || []; // 解析Base64数据，提取图片格式和数据部分
  if (!format) {
    return new Error("ERROR_BASE64SRC_PARSE"); // 如果无法解析，返回错误信息
  }

  // 根据不同的平台设置文件路径
  let filePath;
  switch (process.env.PLATFORM) {
    case "mp-kuaishou":
      filePath = `${ks.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
      break;
    case "mp-toutiao":
      const { microapp, common } = uni.getEnvInfoSync();
      filePath = `${common.USER_DATA_PATH}/${
        FILE_BASE_NAME + Date.now()
      }.${format}`;
      break;
    case "mp-weixin":
      filePath = `${wx.env.USER_DATA_PATH}/${
        FILE_BASE_NAME + Date.now()
      }.${format}`;
      break;
    default:
      filePath = `${uni.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
  }

  const buffer = uni.base64ToArrayBuffer(bodyData); // 将Base64数据转换为ArrayBuffer对象
  fsm.writeFile({
    filePath, // 设置文件路径
    data: buffer, // 设置文件内容为ArrayBuffer对象
    encoding: "binary", // 设置文件编码为二进制
    success() {
      cb(filePath); // 写入成功时调用回调函数，并传递文件路径作为参数
    },
    fail() {
      return new Error("ERROR_BASE64SRC_WRITE"); // 写入失败时返回错误信息
    },
  });
}

export {
  base64src, // 导出base64src函数，以便在其他模块中使用
};
