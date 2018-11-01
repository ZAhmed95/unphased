# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

p "Deleting all users"
User.destroy_all

p "creating seed users"
User.create(
  email: 'test@gmail.com',
  password: '123456',
  password_confirmation: '123456'
)
