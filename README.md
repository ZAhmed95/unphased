# UNPHASED

Unphased is a fully graphical and interactive application that allows users to create stunning browser games without needing a drop of programming knowledge. [Check it out here](https://phaser-game-maker.herokuapp.com)

## How it works

Unphased is a graphical wrapper for the Phaser 3 game making framework. This means that all you have to do is click on buttons or drag and drop files, and Unphased writes all the code for you.
Anything you would be able to do by simply using Phaser to write your game, you can do with Unphased.
*At least, that's the goal. We're not quite there yet :)*

## Features (v1.0.0)

- Create, manage, and test multiple games with one account
- Load Tiled format tilemaps
- Load assets (images, audio, etc.)
- Add player to map

And that's it (for now!)
I'm continuously adding more features, so if the functionality you want is missing, it's probably coming soon.

## What I'm currently working on

Starting with highest priority:

- Refactoring the code structure so that each "feature" (loading map, adding player, etc) is assosciated with one controller, the Rails way. The goal is to make the code extremely structured and extensible, so that a solid foundation is set for adding new features.
- Implementing the core game features:
  - Interactions between gameobjects (player and others)
  - Event trigger/subscription system to manage game logic
  - Adding animations and audio
