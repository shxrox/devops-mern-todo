const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// --- GET all tasks ---
// Matches the test expectation: returns { tasks: [...] }
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        // Crucial fix: Wrap the array in an object with the 'tasks' key
        res.status(200).json({ tasks: tasks }); 
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).json({ message: 'Server Error: Could not retrieve tasks.' });
    }
});

// --- POST create task ---
router.post('/', async (req, res) => {
    const newTask = new Task({ 
        // Ensure the field name matches your Mongoose model
        text: req.body.text 
    });
    
    try {
        const savedTask = await newTask.save();
        // Use 201 Created for a successful resource creation
        res.status(201).json(savedTask); 
    } catch (error) {
        // Use 400 Bad Request for client-side input validation errors
        console.error("Error creating task:", error.message);
        res.status(400).json({ message: error.message });
    }
});

// --- DELETE task ---
router.delete('/:id', async (req, res) => {
    try {
        // Find by ID and delete the document
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            // If findByIdAndDelete returns null, the task was not found
            return res.status(404).json({ message: 'Task not found' });
        }

        // Use 200 OK or 204 No Content for a successful deletion
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        // Handle database errors or invalid ID format (e.g., CastError)
        console.error("Error deleting task:", error.message);
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;