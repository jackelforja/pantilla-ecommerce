export default async function handler(req, res) {
  // 1. Verificamos que la petición sea correcta
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten peticiones POST' });
  }

  // 2. Recibimos los productos del carrito desde tu index.html
  const { items } = req.body;
  
  // ACA IRÁ TU CREDENCIAL REAL DE MERCADO PAGO LUEGO
  const ACCESS_TOKEN = "APP_USR-2186485771338812-090920-a65b1d13ee255c188cbafbb1f1e59dfa-3676709883"; 

  try {
    // 3. Le pedimos a Mercado Pago que cree un link de cobro
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items,
        back_urls: {
          success: "https://pantilla-ecommerce.vercel.app/",
          failure: "https://pantilla-ecommerce.vercel.app/",
          pending: "https://pantilla-ecommerce.vercel.app/"
        },
        auto_return: "approved"
      }),
    });

    const data = await response.json();
    
    // 4. Devolvemos el link de pago a tu página visual
    return res.status(200).json({ link_pago: data.init_point });
    
  } catch (error) {
    return res.status(500).json({ error: 'Error al comunicarse con Mercado Pago' });
  }
}
