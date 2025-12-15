module.exports = function generateUsername() {
  const animals = ["Cat", "Tiger", "Panther", "Lion", "Leopard"];
  const colors = ["Red", "Blue", "Black", "White", "Silver"];

  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const number = Math.floor(100 + Math.random() * 900);

  return `ZC_${color}${animal}${number}`;
};
