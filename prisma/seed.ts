import { PrismaClient, Role, ItemType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.savedPlace.deleteMany();
  await prisma.review.deleteMany();
  await prisma.touristPlace.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.salon.deleteMany();
  await prisma.college.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  // Create Cities
  const jaipur = await prisma.city.create({
    data: {
      name: "Jaipur",
      state: "Rajasthan",
      country: "India",
      description:
        "The Pink City of India, world-renowned for its majestic palaces, iconic forts, lively bazaars, and rich cultural heritage.",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
      latitude: 26.9124,
      longitude: 75.7873,
    },
  });

  const delhi = await prisma.city.create({
    data: {
      name: "Delhi",
      state: "Delhi",
      country: "India",
      description:
        "The historic capital territory of India, combining ancient monuments, bustling food streets, and modern metropolis life.",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
      latitude: 28.6139,
      longitude: 77.209,
    },
  });

  const mumbai = await prisma.city.create({
    data: {
      name: "Mumbai",
      state: "Maharashtra",
      country: "India",
      description:
        "The City of Dreams, financial capital of India, famous for Marine Drive, Gateway of India, and Bollywood glamour.",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80",
      latitude: 19.076,
      longitude: 72.8777,
    },
  });

  const bengaluru = await prisma.city.create({
    data: {
      name: "Bengaluru",
      state: "Karnataka",
      country: "India",
      description:
        "The Silicon Valley of India and the Garden City, recognized for tech innovation, pleasant climate, and craft brewery culture.",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80",
      latitude: 12.9716,
      longitude: 77.5946,
    },
  });

  const udaipur = await prisma.city.create({
    data: {
      name: "Udaipur",
      state: "Rajasthan",
      country: "India",
      description:
        "The City of Lakes and Venice of the East, famed for romantic palace hotels, calm waters, and Rajput architecture.",
      image:
        "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1600&q=80",
      latitude: 24.5854,
      longitude: 73.7125,
    },
  });

  const agra = await prisma.city.create({
    data: {
      name: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      description:
        "Home to the timeless Taj Mahal, Agra Fort, and rich Mughal craftsmanship and culinary traditions.",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
      latitude: 27.1767,
      longitude: 78.0081,
    },
  });

  const varanasi = await prisma.city.create({
    data: {
      name: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
      description:
        "One of the world's oldest continuously inhabited spiritual capitals, located on the banks of the sacred Ganges.",
      image:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80",
      latitude: 25.3176,
      longitude: 82.9739,
    },
  });

  const lucknow = await prisma.city.create({
    data: {
      name: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
      description:
        "The City of Nawabs, celebrated for its Awadhi cuisine, Chikankari embroidery, and courtly etiquette.",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
      latitude: 26.8467,
      longitude: 80.9462,
    },
  });

  // Create Users
  const passwordHash = await bcrypt.hash("admin123", 10);
  const demoPasswordHash = await bcrypt.hash("demo123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Muskan Admin",
      email: "admin@muskan.city",
      passwordHash,
      role: Role.ADMIN,
      currentCityId: jaipur.id,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Muskan User",
      email: "demo@muskan.city",
      passwordHash: demoPasswordHash,
      role: Role.USER,
      currentCityId: jaipur.id,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });

  // 1. Tourist Places in Jaipur
  const amberFort = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Amber Fort (Amer Fort)",
      category: "Fort",
      description:
        "Perched high on a hill overlooking Maota Lake, Amer Fort is a UNESCO World Heritage site known for its artistic Hindu style elements, ornate mirror work (Sheesh Mahal), and grand courtyards.",
      address: "Devisinghpura, Amer, Jaipur, Rajasthan 302028",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 1420,
      openingHours: "08:00 AM - 05:30 PM, 06:30 PM - 09:15 PM (Night Tour)",
      entryFee: "₹100 (Indians), ₹500 (Foreigners)",
      latitude: 26.9855,
      longitude: 75.8513,
    },
  });

  const hawaMahal = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Hawa Mahal (Palace of Winds)",
      category: "Palace",
      description:
        "Built in 1799 by Maharaja Sawai Pratap Singh, this five-story palace features 953 intricately carved jharokhas (small windows) designed to allow royal ladies to observe street life unseen.",
      address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
      image:
        "https://images.unsplash.com/photo-1609137144822-26a575a7c295?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 1850,
      openingHours: "09:00 AM - 05:00 PM",
      entryFee: "₹50 (Indians), ₹200 (Foreigners)",
      latitude: 26.9239,
      longitude: 75.8267,
    },
  });

  const cityPalace = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "City Palace",
      category: "Palace",
      description:
        "A stunning blend of Rajasthani and Mughal architecture in the heart of the Old City. Features courtyards, museums, the famous peacock gate, and the Chandra Mahal royal residence.",
      address: "Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002",
      image:
        "https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=1200&q=80",
      rating: 4.6,
      reviewCount: 980,
      openingHours: "09:30 AM - 05:00 PM, 07:00 PM - 10:00 PM",
      entryFee: "₹200 (Indians), ₹700 (Foreigners)",
      latitude: 26.9258,
      longitude: 75.8237,
    },
  });

  const jalMahal = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Jal Mahal (Water Palace)",
      category: "Heritage Site",
      description:
        "A magnificent yellow sandstone palace appearing to float in the middle of Man Sagar Lake. Surrounded by the Aravalli hills, it creates breathtaking sunset vistas.",
      address: "Amer Rd, Jal Mahal, Amer, Jaipur, Rajasthan 302002",
      image:
        "https://images.unsplash.com/photo-1602753176686-2a77a94f6f87?auto=format&fit=crop&w=1200&q=80",
      rating: 4.5,
      reviewCount: 750,
      openingHours: "Open 24 hours (View from promenade)",
      entryFee: "Free promenade access",
      latitude: 26.9535,
      longitude: 75.8462,
    },
  });

  const nahargarhFort = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Nahargarh Fort",
      category: "Fort",
      description:
        "Standing on the edge of the Aravalli Hills, Nahargarh Fort offers panoramic aerial views of the entire Pink City. Famous for sunset viewing and the Madhavendra Bhawan royal suites.",
      address: "Krishna Nagar, Brahampuri, Jaipur, Rajasthan 302002",
      image:
        "https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 1100,
      openingHours: "10:00 AM - 05:30 PM",
      entryFee: "₹50 (Indians), ₹200 (Foreigners)",
      latitude: 26.9378,
      longitude: 75.8155,
    },
  });

  const albertHall = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Albert Hall Museum",
      category: "Museum",
      description:
        "The oldest museum in Rajasthan, showcasing Indo-Saracenic architecture, rare carpets, Persian paintings, sculptures, and a famous Egyptian mummy.",
      address: "Museum Rd, Ram Niwas Garden, Kailash Puri, Adarsh Nagar, Jaipur, Rajasthan 302004",
      image:
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
      rating: 4.6,
      reviewCount: 890,
      openingHours: "09:00 AM - 05:00 PM, 07:00 PM - 10:00 PM (Night)",
      entryFee: "₹40 (Indians), ₹300 (Foreigners)",
      latitude: 26.9116,
      longitude: 75.8195,
    },
  });

  const patrikaGate = await prisma.touristPlace.create({
    data: {
      cityId: jaipur.id,
      name: "Patrika Gate",
      category: "Heritage Site",
      description:
        "A vibrant, richly painted architectural gateway entrance to Jawahar Circle. Every archway is hand-painted depicting the vibrant cultural history of Rajasthan.",
      address: "Jawahar Circle, Malviya Nagar, Jaipur, Rajasthan 302017",
      image:
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 1320,
      openingHours: "Open 24 hours",
      entryFee: "Free Entry",
      latitude: 26.8532,
      longitude: 75.8052,
    },
  });

  // 2. Businesses in Jaipur
  const tapri = await prisma.business.create({
    data: {
      cityId: jaipur.id,
      name: "Tapri Central",
      category: "Cafe & Lounge",
      description:
        "Jaipur's most beloved rooftop tea lounge overlooking Central Park, serving authentic cutting chai, gourmet finger food, and contemporary snacks with a warm bohemian vibe.",
      address: "B4-E, Prithviraj Rd, opposite Central Park Gate No. 4, C Scheme, Jaipur 302001",
      phone: "+91 141 401 2697",
      email: "hello@tapri.net",
      website: "https://tapri.net",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 1650,
      latitude: 26.9065,
      longitude: 75.8066,
      openingHours: "07:30 AM - 10:15 PM (Closed Tuesday morning)",
    },
  });

  const lmb = await prisma.business.create({
    data: {
      cityId: jaipur.id,
      name: "Laxmi Misthan Bhandar (LMB)",
      category: "Traditional Sweets & Restaurant",
      description:
        "Legendary culinary institution in Johari Bazaar since 1727, world-famous for Rajasthani Ghewar, Pyaaz Kachori, and royal Rajasthani Thali.",
      address: "98-101, Johari Bazar, Biseswarji, Jaipur, Rajasthan 302003",
      phone: "+91 141 256 5844",
      email: "info@hotellmb.com",
      website: "https://hotellmb.com",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      rating: 4.6,
      reviewCount: 2200,
      latitude: 26.9205,
      longitude: 75.8285,
      openingHours: "08:00 AM - 11:00 PM",
    },
  });

  const handi = await prisma.business.create({
    data: {
      cityId: jaipur.id,
      name: "Handi Restaurant",
      category: "Fine Dining",
      description:
        "Award-winning North Indian and Mughlai dining destination on MI Road, acclaimed for Lal Maas, Handi Meat, and traditional clay-pot delicacies.",
      address: "Maya Mansion, Opposite GPO, MI Road, Jaipur, Rajasthan 302001",
      phone: "+91 141 236 4839",
      website: "https://handirestaurant.com",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      rating: 4.5,
      reviewCount: 840,
      latitude: 26.9189,
      longitude: 75.8115,
      openingHours: "12:00 PM - 11:00 PM",
    },
  });

  const anokhi = await prisma.business.create({
    data: {
      cityId: jaipur.id,
      name: "Anokhi Cafe & Boutique",
      category: "Boutique & Organic Cafe",
      description:
        "Chic boutique space featuring handcrafted block-printed textiles alongside an organic European-inspired cafe serving fresh salads, cakes, and artisanal coffee.",
      address: "KK Square, Prithviraj Rd, Panch Batti, C Scheme, Ashok Nagar, Jaipur 302001",
      phone: "+91 141 400 7245",
      website: "https://anokhi.com",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 620,
      latitude: 26.9092,
      longitude: 75.8035,
      openingHours: "10:00 AM - 07:30 PM",
    },
  });

  const barPalladio = await prisma.business.create({
    data: {
      cityId: jaipur.id,
      name: "Bar Palladio Jaipur",
      category: "Bar & Italian Ristorante",
      description:
        "An enchanting Italian bar draped in electric oriental blue and Venetian style inside the Kanota Bagh gardens, renowned for crafted cocktails and candlelit dinners.",
      address: "Hotel Narain Niwas Palace, Kanota Bagh, Narayan Singh Circle, Jaipur 302004",
      phone: "+91 141 256 5556",
      website: "https://bar-palladio.com",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 990,
      latitude: 26.9015,
      longitude: 75.8188,
      openingHours: "06:00 PM - 11:30 PM",
    },
  });

  // 3. Colleges in Jaipur
  const mnit = await prisma.college.create({
    data: {
      cityId: jaipur.id,
      name: "Malaviya National Institute of Technology (MNIT)",
      type: "Engineering & Technology",
      description:
        "Institute of National Importance established in 1963, featuring a lush 317-acre green campus, cutting-edge labs, and tier-1 engineering and architectural programs.",
      address: "Jawahar Lal Nehru Marg, Jhalana Doongri, Jaipur, Rajasthan 302017",
      phone: "+91 141 252 9078",
      website: "https://mnit.ac.in",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 480,
    },
  });

  const smsMedical = await prisma.college.create({
    data: {
      cityId: jaipur.id,
      name: "Sawai Man Singh (SMS) Medical College",
      type: "Medical Science",
      description:
        "Premier government medical college and research institution in Rajasthan, founded in 1947, recognized across India for advanced medical education and clinical research.",
      address: "Jawahar Lal Nehru Marg, Gangawal Park, Adarsh Nagar, Jaipur, Rajasthan 302004",
      phone: "+91 141 256 0291",
      website: "https://education.rajasthan.gov.in/smsmcjaipur",
      image:
        "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 360,
    },
  });

  const univRaj = await prisma.college.create({
    data: {
      cityId: jaipur.id,
      name: "University of Rajasthan",
      type: "Public State University",
      description:
        "The oldest public university in Rajasthan, established in 1947, providing comprehensive undergraduate, postgraduate, and doctoral degrees across sciences, arts, and commerce.",
      address: "Jawahar Lal Nehru Marg, Jaipur, Rajasthan 302004",
      phone: "+91 141 270 6813",
      website: "https://uniraj.ac.in",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
      rating: 4.3,
      reviewCount: 520,
    },
  });

  const manipalJaipur = await prisma.college.create({
    data: {
      cityId: jaipur.id,
      name: "Manipal University Jaipur (MUJ)",
      type: "Multidisciplinary Private University",
      description:
        "Modern NAAC A+ accredited residential campus offering world-class infrastructure, global exchange programs, and contemporary courses in tech, design, and business.",
      address: "Jaipur-Ajmer Express Highway, Dehmi Kalan, Near GVK Toll Plaza, Jaipur 303007",
      phone: "+91 141 399 9100",
      website: "https://jaipur.manipal.edu",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      rating: 4.5,
      reviewCount: 410,
    },
  });

  // 4. Salons in Jaipur
  const styleNScissors = await prisma.salon.create({
    data: {
      cityId: jaipur.id,
      name: "Style 'N' Scissors Luxury Salon & Spa",
      description:
        "Jaipur's premier luxury wellness brand offering customized hair styling, revitalizing skincare therapies, bridal grooming, and international spa treatments.",
      services: "Hair Styling, Hair Spa, Keratin, Bridal Makeup, Hydra Facial, Body Polishing, Nail Art",
      address: "Opp. City Pulse Mall, Narayan Singh Circle, Tonk Rd, Jaipur 302004",
      phone: "+91 141 402 7777",
      website: "https://stylenscissors.com",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      rating: 4.7,
      reviewCount: 390,
      openingHours: "10:00 AM - 08:30 PM",
    },
  });

  const looksSalon = await prisma.salon.create({
    data: {
      cityId: jaipur.id,
      name: "Looks Salon C-Scheme",
      description:
        "Leading unisex styling salon equipped with senior stylists, L'Oréal professional care, high-end hair transformations, and premium nail art studios.",
      services: "Unisex Haircut, Balayage, Moroccan Hair Spa, Organic Facials, Manicure & Pedicure",
      address: "Plot No. D-38, Subhash Marg, C Scheme, Ashok Nagar, Jaipur 302001",
      phone: "+91 141 404 0404",
      website: "https://lookssalon.in",
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      rating: 4.6,
      reviewCount: 310,
      openingHours: "10:00 AM - 09:00 PM",
    },
  });

  const toniAndGuy = await prisma.salon.create({
    data: {
      cityId: jaipur.id,
      name: "Toni & Guy Jaipur",
      description:
        "International British hairdressing label bringing runway fashion, precision cuts, master colorists, and avant-garde style to Pink City residents.",
      services: "Precision Haircuts, Creative Color, Highlights, Deep Conditioning, Beard Grooming",
      address: "S-18, Ground Floor, GT Central Mall, Malviya Nagar, Jaipur 302017",
      phone: "+91 141 405 6789",
      website: "https://toniandguy.com",
      image:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 280,
      openingHours: "10:30 AM - 09:30 PM",
    },
  });

  // 5. Cinemas in Jaipur
  const rajMandir = await prisma.cinema.create({
    data: {
      cityId: jaipur.id,
      name: "Raj Mandir Cinema",
      description:
        "Often crowned 'The Pride of Asia', Raj Mandir opened in 1976 and is famous for its meringue-like Art Deco auditorium, chandelier lobby, and sheer cinematic grandeur.",
      address: "C-16, Bhagwan Das Rd, Panch Batti, C Scheme, Ashok Nagar, Jaipur, Rajasthan 302001",
      phone: "+91 141 237 4694",
      website: "https://rajmandircinema.com",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      rating: 4.8,
      reviewCount: 2400,
      facilities: "Single Screen Heritage, Dolby 7.1, Royal Lobby, Diamond Tier Recliners, Cafe",
    },
  });

  const inoxGtCentral = await prisma.cinema.create({
    data: {
      cityId: jaipur.id,
      name: "INOX Megaplex (GT Central)",
      description:
        "The ultimate multiplex experience in Malviya Nagar featuring INSIGNIA luxury dining, Dolby Atmos 3D sound, and plush laser projection screens.",
      address: "GT Central Mall, Gaurav Tower Marg, Malviya Nagar, Jaipur, Rajasthan 302017",
      phone: "+91 141 511 6000",
      website: "https://pvrcinemas.com",
      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
      rating: 4.6,
      reviewCount: 1540,
      facilities: "INSIGNIA Recliners, IMAX Screen, Dolby Atmos, Gourmet Food on Seat, Valet",
    },
  });

  const cinepolisWtp = await prisma.cinema.create({
    data: {
      cityId: jaipur.id,
      name: "Cinépolis (World Trade Park)",
      description:
        "Located inside Jaipur's futuristic World Trade Park mall, providing VIP lounges, crisp 4K laser projection, and recliner comfort.",
      address: "5th Floor, World Trade Park, Jawahar Lal Nehru Marg, D-Block, Malviya Nagar, Jaipur 302017",
      phone: "+91 141 710 1100",
      website: "https://cinepolisindia.com",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
      rating: 4.5,
      reviewCount: 1220,
      facilities: "4K Laser, RealD 3D, VIP Lounge, Dolby 7.1, Live Snacks Counter",
    },
  });

  // Create initial reviews
  await prisma.review.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.TOURIST_PLACE,
      itemId: amberFort.id,
      rating: 5,
      comment:
        "The Sheesh Mahal inside Amber Fort is pure poetry in glass! The view of Maota lake in the morning is unforgettable. Must take a certified guide.",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      itemType: ItemType.TOURIST_PLACE,
      itemId: hawaMahal.id,
      rating: 5,
      comment:
        "The pink facade glowing under early morning sunlight is mesmerizing. Go to the rooftop cafes opposite the street for the best photography spot.",
    },
  });

  await prisma.review.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.BUSINESS,
      itemId: tapri.id,
      rating: 5,
      comment:
        "Best place for evening tea in Jaipur! The Saunf Chai and Khakhra Pizza are top notch. Gorgeous view of Central Park.",
    },
  });

  await prisma.review.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.CINEMA,
      itemId: rajMandir.id,
      rating: 5,
      comment:
        "More than a cinema hall, it's a royal palace experience! Watching any Bollywood movie here with the crowd cheering is an unmatched Jaipur vibe.",
    },
  });

  // Create initial saved places
  await prisma.savedPlace.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.TOURIST_PLACE,
      itemId: amberFort.id,
    },
  });

  await prisma.savedPlace.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.BUSINESS,
      itemId: tapri.id,
    },
  });

  await prisma.savedPlace.create({
    data: {
      userId: demoUser.id,
      itemType: ItemType.CINEMA,
      itemId: rajMandir.id,
    },
  });

  console.log("Database seeded successfully with Jaipur and demo dataset!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
