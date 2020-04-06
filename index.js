const express = require('express');
const server = express();
const port = 5000;

server.use(express.json());

server.listen(port, () => {
   console.log(`Server running on port ${port}.`);
});

let users = [{
   id: 0,
   name: 'biskoi',
   bio: 'not even once'
}, {
   id: 1,
   name: 'notkoi',
   bio: 'always'
}];


server.get('/api/users', (req, res) => {
   if (users) {
      res.status(200).json(users);
   } else {
      res.status(500).json({message: 'Oh no! The users are all gone!'})
   }
});

server.get('/api/users/:id', (req, res) => {
   
   const id = req.params.id;
   const user = users.find(item => item.id == id);

   // if (user) {
   //    res.status(200).json(user)
   // } else {
   //    res.status(404).json({
   //       message: `No users with the ID of ${id}.`
   //    });
   // };

   if (!users) { // Checks to see if main users array is accessible?
      res.status(500).json({
         message: 'The server could not access the users database.'
      });
   } else if (!user) { // Checks to see if users.find(id) returned anything
      res.status(404).json({
         message: `No users with the ID of ${id}.`
      });
   } else {
      res.status(200).json(user)
   };

});

server.post('/api/users', (req, res) => {
   const newUser = req.body;
   newUser.id = Date.now();

   if (!newUser.name || !newUser.bio) {
      res.status(400).json({message: 'Please provide a name and bio for the new user.'})
   } else {
      users.push(newUser);
      // console.log('wouldve pushed');
   };

   if (users.find(item => item.name === newUser.name)) {
      res.status(201).json(users);
   } else {
      res.status(500).json({message: 'Server could not save new user.'});
   };

});

server.put('/api/users/:id', (req, res) => {

   const id = req.params.id;
   const toEdit = users.find(item => item.id == id);
   const newArray = users.filter(item => item != toEdit);
   const editedUser = {
      ...toEdit,
      name: req.body.name ? req.body.name : toEdit.name,
      bio: req.body.bio ? req.body.bio : toEdit.bio
   };

   if (!toEdit) {
      res.status(404).json({
         message: `User ID ${id} not found.`
      });
   } else if (!req.body.name || !req.body.bio) {
      res.status(400).json({
         message: 'Please send both the name and bio.'
      });
   } else {
      newArray.push(editedUser);
   };

   if (!newArray.find(item => item === editedUser)) {
      res.status(500).json({
         message: 'Server could not modify user.'
      })
   } else {
      users = newArray;
      res.status(200).json(editedUser);
   };

});

server.delete('/api/users/:id', (req, res) => {

   const id = req.params.id;
   const toDelete = users.find(item => item.id == id)
   const newArray = users.filter(item => item.id != id);

   if (!toDelete) {
      res.status(404).json({
         message: `User with id ${id} could not be found.`
      });
   } else if (newArray.find(item => item.id == id)) {
      res.status(500).json({
         message: 'Server was not able to delete user.'
      });
   } else {
      users = newArray;
      res.status(200).json(toDelete);
   }

   // users = newArray;
   // res.status(200).json(users);

});

