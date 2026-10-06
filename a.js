require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();
const PORT = 3000;

// Connect to Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// STUDENT: JOIN QUEUE
// ===============================

app.post("/api/queue", async (req, res) => {

    const { name, food } = req.body;

    if (!name || !food) {
        return res.status(400).json({
            message: "Name and food are required"
        });
    }

    const { data, error } = await supabase
        .from("queue")
        .insert([
            {
                name: name,
                food: food,
                status: "waiting"
            }
        ])
        .select()
        .single();

    if (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }

    res.json({
        message: "Successfully joined queue",
        queueNumber: data.id
    });
});


// ===============================
// GET CURRENT QUEUE
// ===============================

app.get("/api/queue", async (req, res) => {

    const { data, error } = await supabase
        .from("queue")
        .select("*")
        .eq("status", "waiting")
        .order("id", { ascending: true });

    if (error) {

        console.error(error);

        return res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }

    res.json(data);
});


// ===============================
// ADMIN: MARK QUEUE AS SERVED
// ===============================

app.put("/api/queue/:id/serve", async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("queue")
        .update({
            status: "served"
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {

        console.error(error);

        return res.status(500).json({
            message: "Could not mark queue as served",
            error: error.message
        });
    }

    res.json({
        message: "Queue served successfully",
        data: data
    });
});


// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Canteen Queue running at http://localhost:${PORT}`
    );

});