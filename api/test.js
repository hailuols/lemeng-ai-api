export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.status(200).json({
    ok: true,
    message: "乐萌AI中转API连接成功",
    time: new Date().toISOString()
  });
}
