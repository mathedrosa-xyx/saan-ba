// Hard-coded prototype data. Coordinates are approximate; fares/ETAs are sample estimates.
const PLACES = {
  namagbagan: { name: "Namagbagan, Sta. Maria", short: "Namagbagan", ll: [15.9905, 120.6905] },
  stamaria:   { name: "Sta. Maria Town Proper", short: "Sta. Maria", ll: [16.0012, 120.7011] },
  tayug:      { name: "Tayug Town Proper", short: "Tayug", ll: [16.0268, 120.7449] },
  sunflower:  { name: "Tayug Sunflower Eco Park", short: "Sunflower Eco Park", ll: [16.0390, 120.7650], spot: true, grad: ["#F2C14E", "#E07A1F"] },
  naturepark: { name: "Sta. Maria Nature Park", short: "Nature Park", ll: [16.0105, 120.7180], spot: true, grad: ["#34D399", "#065F46"] },
  urdaneta:   { name: "Urdaneta (CSI / Magic Mall)", short: "Urdaneta", ll: [15.9761, 120.5711] },
  manaoag:    { name: "Manaoag Church", short: "Manaoag", ll: [16.0439, 120.4875], spot: true, grad: ["#C084FC", "#6D28D9"] },
  dagupan:    { name: "Dagupan City (Downtown)", short: "Dagupan", ll: [16.0433, 120.3333] },
  bonuan:     { name: "Bonuan Beach (Tondaligan)", short: "Bonuan Beach", ll: [16.0745, 120.3405], spot: true, grad: ["#38BDF8", "#F59E0B"] },
  hundred:    { name: "Hundred Islands, Alaminos", short: "Hundred Islands", ll: [16.1930, 119.9425], spot: true, grad: ["#06B6D4", "#0B4F6C"] },
  cubao:      { name: "Cubao, Manila", short: "Cubao", ll: [14.6197, 121.0537] }
};

// Each step: [mode, title, instruction, fare, minutes, toPlaceKey]
const ROUTES = [
  { id: "r1", from: "namagbagan", to: "sunflower", km: 9, eta: "35–45 min", fare: 65,
    steps: [["trike", "Trike to Sta. Maria highway", "Sabihin: \"Sa highway po, sakay ng jeep.\"", 20, 8, "stamaria"],
            ["jeep", "Jeep (Sta. Maria → Tayug)", "Baba sa Tayug Welcome Arch.", 15, 15, "tayug"],
            ["trike", "Trike to Sunflower Eco Park", "Special trip kung walang kasabay.", 30, 12, "sunflower"]],
    tip: "Best time: early morning, before it gets too hot." },
  { id: "r2", from: "tayug", to: "naturepark", km: 6, eta: "15–20 min", fare: 70,
    steps: [["trike", "Trike special trip", "Sabihin: \"Nature Park po, Sta. Maria.\"", 70, 18, "naturepark"]],
    tip: "Ask the driver to wait or get his number for the trip back." },
  { id: "r3", from: "tayug", to: "urdaneta", km: 30, eta: "50–70 min", fare: 90,
    steps: [["van", "Van direct to Urdaneta", "Sakay sa Tayug public market.", 70, 50, "urdaneta"],
            ["trike", "Trike to the mall", "Sabihin: \"CSI po\" o \"Magic po.\"", 20, 10, "urdaneta"]],
    tip: "Expect traffic on MacArthur Hwy on weekend afternoons." },
  { id: "r4", from: "tayug", to: "dagupan", km: 60, eta: "1.5–2 hrs", fare: 130,
    steps: [["bus", "Bus or van at Tayug terminal", "Hanapin ang signboard na 'DAGUPAN'.", 120, 95, "dagupan"],
            ["walk", "Walk to Perez Blvd", "Mga 5 minuto mula sa terminal.", 0, 5, "dagupan"]],
    tip: "Vans leave once full. Buses leave on a schedule." },
  { id: "r5", from: "dagupan", to: "manaoag", km: 18, eta: "40–50 min", fare: 45,
    steps: [["jeep", "Jeep Dagupan → Manaoag", "Terminal near the city plaza.", 40, 40, "manaoag"],
            ["walk", "Walk to the Basilica", "Sundan lang ang dami ng tao.", 0, 5, "manaoag"]],
    tip: "Very crowded on Sundays and during Holy Week." },
  { id: "r6", from: "dagupan", to: "bonuan", km: 5, eta: "15–20 min", fare: 15,
    steps: [["jeep", "Jeep to Bonuan (Tondaligan)", "Sakay sa A.B. Fernandez Ave.", 15, 15, "bonuan"]],
    tip: "Sunset is the best time to go." },
  { id: "r7", from: "dagupan", to: "hundred", km: 55, eta: "1.5–2 hrs", fare: 130,
    steps: [["bus", "Bus to Alaminos", "Victory or Five Star going to Alaminos/Bolinao.", 100, 80, "hundred"],
            ["trike", "Trike to Lucap Wharf", "Mga 10 minuto.", 30, 10, "hundred"],
            ["boat", "Boat to the islands", "Boat rental is separate; split it with your group.", 0, 20, "hundred"]],
    tip: "Bring cash. There are few ATMs near the wharf." },
  { id: "r8", from: "urdaneta", to: "cubao", km: 180, eta: "4–5 hrs", fare: 550,
    steps: [["bus", "Provincial bus to Cubao", "Five Star / Victory / Genesis.", 550, 270, "cubao"]],
    tip: "Book ahead on long weekends." }
];
