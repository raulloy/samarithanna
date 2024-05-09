const data = {
  products: [
    {
      name: 'Jocoque seco grande',
      slug: 'jocoque-seco-grande',
      category: 'Jocoque',
      quantity: '480 gr.',
      presentation: 'Pieza',
      image: '/images/Jocoque Seco.png',
      price: 149,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'El jocoque o jocoqui es un producto tradicional preparado a base de leche fermentada que es excelente para acompañar diversos platillos de la gastronomía mexicana; no importa si son salados o dulces, el jocoque va con todo.',
    },
    {
      name: 'Jocoque seco chico',
      slug: 'jocoque-seco-chico',
      category: 'Jocoque',
      quantity: '240 gr.',
      presentation: 'Pieza',
      image: '/images/Jocoque Seco.png',
      price: 91,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'El jocoque o jocoqui es un producto tradicional preparado a base de leche fermentada que es excelente para acompañar diversos platillos de la gastronomía mexicana; no importa si son salados o dulces, el jocoque va con todo.',
    },
    {
      name: 'Jocoque seco chico con chipotle',
      slug: 'jocoque-seco-chico-chipotle',
      category: 'Jocoque',
      quantity: '240 gr.',
      presentation: 'Pieza',
      image: '/images/Jocoque Seco.png',
      price: 93,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'El jocoque o jocoqui es un producto tradicional preparado a base de leche fermentada que es excelente para acompañar diversos platillos de la gastronomía mexicana; no importa si son salados o dulces, el jocoque va con todo.',
    },
    {
      name: 'Jocoque líquido',
      slug: 'jocoque-liquido',
      category: 'Jocoque',
      quantity: '480 gr.',
      presentation: 'Pieza',
      image: '/images/Jocoque Seco.png',
      price: 97,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Elaborado de leche de vaca, puedes disfrutarlo solo o con tu fruta preferida y miel o bien con un buen plato de arroz, rollos de hoja de parra, también puedes ponerle un toque de hierbabuena, aceite de olivo y sal.',
    },
    {
      name: 'Arracadas de ajonjolí',
      slug: 'arracadas-de-ajonjoli',
      category: 'Pan',
      quantity: '200 gr.',
      presentation: '3 Piezas',
      image: '/images/Arracadas.png',
      price: 123,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Galleta salada elaborada con harina de trigo, cubierta con ajonjolí tostado perfecta para una botana con jocoque, humus o tabule o bien sola para disfrutarla.',
    },
    {
      name: 'Rosquillas de ajonjolí y anís',
      slug: 'rosquillas-ajonjoli-anis',
      category: 'Pan',
      quantity: '240 gr.',
      presentation: '20 Piezas',
      image: '/images/Rosquillas.png',
      price: 99,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Galleta en forma de rosca, elaborada con harina de trigo y anís como parte esencial, espolvoreado con ajonjolí tostado, perfecta para una botana con jocoque.',
    },
    {
      name: 'Pan árabe tostado',
      slug: 'pan-arabe-tostado',
      category: 'Pan',
      quantity: '200 gr.',
      presentation: 'Paquete',
      image: '/images/Pan Arabe Tostado.png',
      price: 148,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Pan elaborado a base de harina de trigo, levadura, azúcar y sal; perfecto para acompañarlo con ingredientes dulces o salados, incluso con tu comida del día, o bien hacer delicioso pan con queso, como pizza o una crepa dulce o salda.',
    },
    {
      name: 'Pan árabe tostado con zathar',
      slug: 'pan-arabe-tostado-zathar',
      category: 'Pan',
      quantity: '200 gr.',
      presentation: 'Paquete',
      image: '/images/Pan Arabe.png',
      price: 158,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Pan elaborado a base de harina de trigo, levadura, azúcar y sal; perfecto para acompañarlo con ingredientes dulces o salados, incluso con tu comida del día, o bien hacer delicioso pan con queso, como pizza o una crepa dulce o salda.',
    },
    {
      name: 'Pan árabe chico',
      slug: 'pan-arabe-chico',
      category: 'Pan',
      quantity: '150 gr.',
      presentation: '10 Piezas',
      image: '/images/Pan Arabe.png',
      price: 65,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Pan elaborado a base de harina de trigo, levadura, azúcar y sal; perfecto para acompañarlo con ingredientes dulces o salados, incluso con tu comida del día, o bien hacer delicioso pan con queso, como pizza o una crepa dulce o salda.',
    },
    {
      name: 'Pan árabe mediano',
      slug: 'pan-arabe-mediano',
      category: 'Pan',
      quantity: '325 gr.',
      presentation: '10 Piezas',
      image: '/images/Pan Arabe.png',
      price: 89,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Pan elaborado a base de harina de trigo, levadura, azúcar y sal; perfecto para acompañarlo con ingredientes dulces o salados, incluso con tu comida del día, o bien hacer delicioso pan con queso, como pizza o una crepa dulce o salda.',
    },
    {
      name: 'Hummus',
      slug: 'hummus',
      category: 'Hummus',
      quantity: '480 gr.',
      presentation: 'Pieza',
      image: '/images/Hummus.png',
      price: 161,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Crema de garbanzos cocidos con zumo de limón, que incluye pasta de tahina y aceite de oliva, que según la variante local puede llevar además otros ingredientes como ajos o pimentón.',
    },
    {
      name: 'Aceituna Kalamata',
      slug: 'aceituna-kalamata',
      category: 'Aceitunas',
      quantity: '300 gr.',
      presentation: 'Pieza',
      image: '/images/Aceituna Kalamata.png',
      price: 195,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Variedad de aceituna de mesa de color oscuro, originaria de Grecia y cultivada también en otros países del Mediterráneo. Está considerada un producto de gran calidad por sus características organolépticas.',
    },
    {
      name: 'Pay de dátil con nuez',
      slug: 'pay-de-datil',
      category: 'Pies',
      quantity: '580 gr.',
      presentation: 'Pieza',
      image: '/images/Pastel de datil.png',
      price: 413,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'El pay de dátil es un dulce árabe ideal para postre ideal para postre o para snack por sus ingredientes energéticos.',
    },
    {
      name: 'Dulces árabes variados',
      slug: 'dulces-arabes-variados',
      category: 'Dulces',
      quantity: '335 gr.',
      presentation: '21 Piezas',
      image: '/images/Miniaturas arabes.png',
      price: 412,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Hechos a base de pasta filo y rellenos de los mejores ingredientes del Medio Oriente (nuez, pistache y nuez de la india)',
    },
    {
      name: 'Dulces árabes variados mini',
      slug: 'dulces-arabes-variados-mini',
      category: 'Dulces',
      quantity: '160 gr.',
      presentation: '10 Piezas',
      image: '/images/Miniaturas arabes.png',
      price: 204,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Hechos a base de pasta filo y rellenos de los mejores ingredientes del Medio Oriente (nuez, pistache y nuez de la india)',
    },
    {
      name: 'Dedo de novia grande',
      slug: 'dedo-de-novia-grande',
      category: 'Pan',
      quantity: '270 gr.',
      presentation: '5 Piezas',
      image: '/images/Dedos de Novia.png',
      price: 255,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description:
        'Los dedos de novia, son el dulce árabe más conocido. El dedo de novia está relleno de nuez y bañado en una miel especial para los dulces árabes  . Es crujiente por fuera y la miel lo hidrata por dentro, así que cuando comes dedos de novia tienes una doble sensación, lo percibes crujiente y suave a la vez.',
    },
    {
      name: 'Greiby grande',
      slug: 'greiby-grande',
      category: 'Greiby',
      quantity: '250 gr.',
      presentation: '5 Piezas',
      image: '/images/Greiby.png',
      price: 245,
      countInStock: 100,
      brand: 'Samarit Hanna',
      description: 'Greiby',
    },
  ],
};

export default data;
