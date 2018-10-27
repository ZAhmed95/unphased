class Game < ApplicationRecord
  belongs_to :user

  has_many_attached :assets
end