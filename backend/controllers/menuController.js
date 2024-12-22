const MenuItem = require('../models/menuModel');

const generateShortName = (name) => {
    return name.toLowerCase().replace(/\s+/g, '_');
}

// Create a new menu item
const menuController = {
    createMenuItem: async (req, res) => {

            try {
                let menuItems = req.body; // Assuming req.body is an array of menu items or a single object
                if (!Array.isArray(menuItems)) {
                    // If req.body is not an array, convert it to an array with a single item
                    menuItems = [menuItems];
                }
                menuItems = menuItems.map(item => ({
                    ...item,
                    shortName: generateShortName(item.name)
                }));
                
                const newItems = await MenuItem.create(menuItems); // Use create method to insert multiple items
                res.status(201).json({ message: 'Menu items created successfully', items: newItems });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        
    },
    
    // Get all menu items
    getAllMenuItems : async (req, res) => {
        try {
            const items = await MenuItem.find();
            res.status(200).json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a menu item by ID
    getMenuItem : async (req, res) => {
        try {
            const {shortName} = req.params;
            console.log(shortName);
            const item = await MenuItem.findOne({shortName});
            if (!item) return res.status(404).json({ message: 'Menu item not found' });
            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update a menu item by ID
    updateMenuItem : async (req, res) => {
        try {
            const {shortName} = req.params;
            const updates = req.body;
            const updatedItem = await MenuItem.findOneAndUpdate({shortName}, { $set: updates }, { new: true });
            if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });
            res.status(200).json({ message: 'Menu item updated successfully', item: updatedItem });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete a menu item by ID
    deleteMenuItem : async (req, res) => {
        try {
            const {shortName} = req.params;
            const deletedItem = await MenuItem.findOneAndDelete({shortName});
            if (!deletedItem) return res.status(404).json({ message: 'Menu item not found' });
            res.status(200).json({ message: 'Menu item deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
}

// Export the controller functions
module.exports = menuController;
