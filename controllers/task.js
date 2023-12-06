import Task from "../models/Task.js";


export const createTask = async (req, res, next) => {
    const newTask = new Task(req.body)

    try {
        const savedTask = await newTask.save()
        res.status(200).json(savedTask)
    } catch (err) {
        next(err)
    }
}

export const updateTask = async (req, res, next) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedTask)
    } catch (err) {
        next(err)
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(200).json('Task as delete')
    } catch (err) {
        next(err)
    }
}
export const getTask = async (req, res, next) => {
    
    try {
        const foundTask = await Task.findById(req.params.id); // Changed variable name to foundTask
        res.status(200).json(foundTask); // Changed variable name here as well
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req, res, next) => {

    const { min, max, others } = req.query;

    try {
        const Tasks = await Task.find({
            others
            
        }).limit(req.query.limit);
        res.status(200).json(Tasks);
    } catch (err) {
        next(err);
    }
};

export const countByTitle = async (req, res, next) => {
    const Titls = req.query.Titls.split(",")

    try {
        const list = await Promise.all(Titls.map(title => {
            return Task.countDocuments({ title: title })
        }))

        res.status(200).json(list)
    } catch (err) {
        next(err)
    }
}






