class Game < ApplicationRecord
  belongs_to :user
  has_many :assets, dependent: :destroy

  validates_presence_of :name, message: 'Name cannot be empty'
end