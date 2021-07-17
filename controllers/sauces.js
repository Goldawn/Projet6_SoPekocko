const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  const newSauce = JSON.parse(req.body.sauce)
  delete req.body._id;
    const sauce = new Sauce({
      ...newSauce,
      userId: req.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: []
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauces = (req, res, next) => {
  console.log(req.params)
  Sauce.findOne({ _id: req.params.id})
  .then((sauce) => {
      console.log(sauce)
      res.status(200).json(sauce)})
  .catch((error) => { res.status(404).json({ error: error })});
};

exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.addLikeDislike = (req, res, next) => {
  console.log(req.params);
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      let usersLikedArray = sauce.usersLiked;
      let usersDislikedArray = sauce.usersDisliked;
      let likesCounter = sauce.likes;
      let dislikesCounter = sauce.dislikes;
    
      if (req.body.like === 1 && !usersLikedArray.includes(req.body.userId)){

        usersLikedArray.push(req.body.userId);
        likesCounter ++;

        Sauce.updateOne({ _id: req.params.id }, { likes: likesCounter, usersLiked: usersLikedArray })
          .then(() => res.status(200).json({ message: "L'utilisateur aime la sauce !"}))
          .catch(error => res.status(400).json({ error }));
      }
    
      else if (req.body.like === 0){

        if(usersLikedArray.includes(req.body.userId)) {
          usersLikedArray = usersLikedArray.filter( e => e !== req.body.userId );
          likesCounter--;
        }

        else {
          usersDislikedArray = usersDislikedArray.filter( e => e !== req.body.userId );
          dislikesCounter--;
        }
    
        Sauce.updateOne({ _id: req.params.id }, { likes: likesCounter, dislikes: dislikesCounter, usersLiked: usersLikedArray, usersDisliked: usersDislikedArray })
          .then(() => res.status(200).json({ message: "L'utilisateur a enlevé son like/dislike"}))
          .catch(error => res.status(400).json({ error }));
      }
    
      else if (req.body.like === -1 && !usersDislikedArray.includes(req.body.userId)){
    
        usersDislikedArray.push(req.body.userId);
        dislikesCounter++;

        Sauce.updateOne({ _id: req.params.id }, { dislikes: dislikesCounter, usersDisliked: usersDislikedArray })
          .then(() => res.status(200).json({ message: "L'utilisateur n'aime pas la sauce"}))
          .catch(error => res.status(400).json({ error }));
      }
      else {
        console.log("exit if function")
        .catch(error => res.status(400).json({ error }));
      }  
    })
    .catch(error => res.status(500).json({ error }));
}