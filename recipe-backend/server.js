const dotenv=require('dotenv');
const express=require('express');
const mongoose=require('mongoose');

const cors=require('cors');
const cookieParser=require("cookie-parser");
const app=express();
const http=require("http");
const {Server}=require("socket.io");

const userRouter =require('./routes/userRoutes');
const recipeRouter=require('./routes/recipeRoutes');
const aiRouter=require('./routes/aiRoutes');
const server=http.createServer(app);
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin:[ 'http://localhost:5173','http://127.0.0.1:5173','https://findmyrecipe-frontend.onrender.com'], // your frontend's URL
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true // allow cookies and credentials
}));
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// OpenAI Real-Time Chatbot
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("send_message", async (data) => {
        try {
            // CALLING AI API
            const reply = "🤖 AI Reply: " + data.text;  // Replace with OpenAI

            socket.emit("bot_reply", { role: "bot", text: reply });

        } catch (err) {
            socket.emit("bot_reply", { role: "bot", text: "Error from AI" });
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});
const connectMongoDB = async()=>{
    try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected at : ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
}

app.use('/api/user',userRouter);
app.use('/api/recipes',recipeRouter);
app.use('/api/ai',require("./routes/aiRoutes"));

const PORT=process.env.SERVER_PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
})
