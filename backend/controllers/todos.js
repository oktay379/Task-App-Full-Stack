import { TodosModel } from "../models/TodosModel.js";



export const createTask = async (req, res) => {
    try {
        const { title, desc, tags } = req.body;
    

        const newTask = new TodosModel({
            user: req.user._id,
            title: title,
            desc: desc,
            file: req.file ? req.file.filename : '',
            tags: tags
        });
        await newTask.save();

        return res.status(201).json({ added: true, newTask, createdBy: req.user.username });
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const getUserTodos = async (req, res) => {
    try {
        const userId = req.user._id;

        const todos = await TodosModel.find({ user: userId });

        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};


export const getTodo = async (req, res) => {
    try {
        const id = req.params.id
        const todo = await TodosModel.findById({ _id: id });
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json(error);
    }
}


export const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, desc } = req.body;

        // Güncelleme objesini oluştur
        const updateFields = { title, desc };

        // Eğer dosya gönderilmişse, dosya adını güncelleme objesine ekle
        if (req.file && req.file.filename) {
            updateFields.file = req.file.filename;
        }

        const task = await TodosModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({ update: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const toggleTaskComplete = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await TodosModel.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.complete = !task.complete;
        await task.save();

        return res.status(200).json({ update: true, task });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id
        const task = await TodosModel.findByIdAndDelete({ _id: id })
        return res.status(200).json({deleted: true});  
    }   
    catch (error) {
        return res.status(500).json(error)
    }
}


export const getTasksByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const tasks = await TodosModel.find({ tags: tag });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks by tag' });
  }
};
