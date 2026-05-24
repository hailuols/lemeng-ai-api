import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("乐萌AI中转API正在运行");
});

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    message: "乐萌AI中转API连接成功",
    time: new Date().toISOString()
  });
});

app.get("/api/chat", async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.status(400).json({
        ok: false,
        error: "缺少 text 参数"
      });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "服务器没有配置 DEEPSEEK_API_KEY"
      });
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content:
              "你是乐萌少儿编程课堂里的AI小助手。回答要适合2-5年级孩子，语言简单、有趣、积极。每次回答尽量控制在80字以内。"
          },
          {
            role: "user",
            content: text
          }
        ],
        thinking: {
          type: "disabled"
        },
        temperature: 0.8,
        max_tokens: 120
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "DeepSeek接口调用失败",
        detail: data
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content || "AI暂时没有想到合适的回答。";

    return res.json({
      ok: true,
      reply
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "服务器内部错误",
      detail: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
