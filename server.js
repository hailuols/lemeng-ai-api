import express from "express";

const app = express();

app.use(express.json());

// 允许 TurboWarp 访问你的接口
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// 首页测试
app.get("/", (req, res) => {
  res.send("乐萌AI中转API正在运行");
});

// TurboWarp 测试接口
app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "乐萌AI中转API连接成功",
    time: new Date().toISOString()
  });
});

// Render 会提供 PORT；本地没有时用 10000
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
