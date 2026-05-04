/**
 * Seed Expat Hub Data to Firestore
 * Run: node seed_expat_hub.js
 * 
 * Requires: Firebase Admin SDK credentials
 * - Download service account key from Firebase Console
 * - Save as: cykel-32383-firebase-adminsdk.json in same directory
 */

const admin = require('firebase-admin');
const serviceAccount = require('./cykel-32383-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Your First Week Cycling in Copenhagen - COMPLETE GUIDE
const firstWeekGuide = {
  title: "Your First Week Cycling in Copenhagen",
  category: "gettingStarted",
  summary: "Everything you need to know for your first week cycling in Copenhagen, from basic rules to cultural tips.",
  difficulty: "beginner",
  readTimeMinutes: 12,
  language: "en",
  tags: ["beginner", "first-time", "copenhagen", "basics", "rules", "culture"],
  isPinned: true,
  author: "CYKEL Team",
  viewCount: 0,
  helpfulCount: 0,
  relatedGuides: [],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  content: `# Your First Week Cycling in Copenhagen 🚴🇩🇰

Congratulations on joining the world's most bike-friendly city! Copenhagen has over 400km of bike lanes and 62% of residents commute by bike daily. This guide will help you navigate your first week confidently.

## 🚦 The Golden Rules

### 1. Always Use Bike Lanes
Copenhagen's bike lanes are clearly marked with blue signs and white bicycle symbols painted on the ground. They're typically 2-2.5 meters wide and separated from car traffic.

**What you need to know:**
- Bike lanes are on the RIGHT side of the road (between sidewalk and car lane)
- Stay in your lane - don't weave between bike lane and sidewalk
- If there's no bike lane, ride on the right side of the road
- Never ride on the sidewalk unless you're under 6 years old

### 2. Signal Your Turns
Danish cyclists are famous for their clear hand signals. It's not just polite - it's expected!

**How to signal:**
- **Left turn:** Extend left arm horizontally
- **Right turn:** Extend right arm horizontally  
- **Stopping:** Raise your hand (either arm) straight up
- Signal at least 5 meters before turning
- Make eye contact with drivers when crossing intersections

### 3. Lights Are Mandatory
From sunset to sunrise, your bike MUST have:
- **Front light:** White or yellow, visible from 300m
- **Rear light:** Red, visible from 300m
- **Reflectors:** Front (white), rear (red), pedals (yellow), wheels

**Fine for cycling without lights: 700 DKK (~$100)**

Buy lights at any bike shop or supermarket. USB-rechargeable lights cost 100-300 DKK.

### 4. Stop at Red Lights
Yes, everyone actually stops at red lights in Copenhagen! Running a red light:
- **Fine:** 1,000 DKK (~$145)
- Dangerous in high-traffic areas
- Will earn you angry looks from locals

Watch for the bicycle traffic lights - they're smaller and positioned at bike lane height.

## 🚲 Getting Your First Bike

### Where to Buy

**New Bikes (2,000-8,000 DKK):**
- **Jensens Cykler** - Multiple locations, great service
- **Bikes.dk** - Large selection, good for commuters
- **Stadiums** - Department store with budget options

**Used Bikes (500-2,000 DKK):**
- **Den Grønne Cykel** - Non-profit, reconditioned bikes
- **DBA.dk** - Danish Craigslist (beware of stolen bikes!)
- **University notice boards** - Students selling when leaving

**Bike Rentals (Long-term):**
- **Swapfiets** - 199 DKK/month with repairs included
- **Donkey Republic** - Short-term rentals via app
- **Bycyklen** - City bikes (free for 15 min periods)

### What to Look For

**Essential features for Copenhagen cycling:**
- **Sturdy frame** - Copenhagen bikes take a beating from daily use
- **Good brakes** - Coaster brake (pedal backward) or hand brakes
- **Lights** - Many new bikes come with build-in dynamo lights
- **Chain guard** - Keeps your clothes clean
- **Rack** - For groceries, bags, or bike baskets
- **Comfortable seat** - You'll be riding daily!

**Optional but recommended:**
- Fenders (mudguards) for rainy days
- Bell (required by law!)
- Basket or panniers for carrying stuff
- Lock holder on frame

## 🔒 Bike Security

Copenhagen has ~30,000 bike thefts per year. Protect your investment!

### Locking Strategy

**The 2-Lock Rule:**
Always use TWO locks of different types:
1. **U-lock (bøjlelås)** - Through frame and rear wheel to fixed object
2. **Chain/cable lock** - Through front wheel and frame

**Good locks cost 400-800 DKK. Cheap locks = stolen bike.**

### Where to Lock

**Safe places:**
- Designated bike racks (cykelstativer)
- Bike parking facilities (cykelparkeringer)
- Metro/train station bike areas

**Avoid:**
- Trees, benches, or temporary fences
- Dark, unmonitored areas
- Leaving your bike overnight in the same spot
- High-theft areas: Nørrebro, Vesterbro late at night

**Pro tip:** Register your bike frame number at [politi.dk](https://politi.dk) - it helps recover stolen bikes.

## 📍 Navigation Tips

### Understanding the System

Copenhagen's bike paths follow a logical grid:
- **Main routes** have green signs with route numbers (e.g., C99, C01)
- **Blue bicycle signs** show direction to nearby areas
- Most routes are bi-directional except on one-way streets

### Popular Routes

**C01 - Vesterbro to Amager Beach:** 8km coastal route  
**C99 - Inner Ring:** Circles the city center  
**Nørrebrogade:** Main north-south artery (busy!)  
**Nyhavn to The Little Mermaid:** Scenic harbor route

### Navigation Apps

**Best apps for cycling:**
- **Google Maps** - Select bicycle mode for bike-friendly routes
- **CYKEL** - Real-time bike path navigation (that's us! 😊)
- **Citymapper** - Public transport + cycling integration
- **Komoot** - Great for longer recreational rides

## 🚦 Right-of-Way Rules

### At Intersections

1. **Green bike light** - You have right of way
2. **Cars turning right** - Must yield to cyclists going straight (but stay alert!)
3. **Buses pulling out** - Technically yield to you, but be careful
4. **Pedestrians crossing bike lane** - They should yield but often don't

**Golden rule: Even when you have right of way, make eye contact with drivers!**

### Roundabouts

Stay in the outer ring and signal when exiting. Cars inside the roundabout have right of way.

### Railroad Crossings

Rails at an angle can catch your wheel! Cross rails at a 90° angle by steering slightly diagonal to the tracks.

## 🌧️ Weather Riding

### Rain (Frequent Sept-March)

**What you need:**
- Waterproof jacket with hood or rain cap
- Waterproof pants or rain legs
- Fenders on your bike (or you'll get soaked from below!)
- Lights (visibility is poor in rain)

**Riding tips:**
- Brake earlier - wet brakes are less effective
- Watch for slippery metal plates, painted lines, and leaves
- Slow down on turns

### Winter (Dec-Feb)

**Copenhagen usually doesn't get super cold, but be prepared:**
- Bike lanes are cleared first (before car roads!)
- Studded tires if there's ice/snow
- Multiple thin layers instead of one thick coat
- Gloves that allow you to brake/shift
- Reflective gear (it's dark 16+ hours!)

### Wind (Year-round)

Copenhagen is WINDY! Strong headwinds are common.
- Lower gears for headwinds
- Tuck in elbows for less resistance
- Check wind forecast on DMI.dk

## 🚨 What to Do If...

### You Get a Flat Tire

1. Walk your bike to nearest bike shop
2. Most shops fix flats for 50-150 DKK
3. Learn to do it yourself - YouTube + 300 DKK repair kit

**24/7 air pumps:** Many metro stations have free air pumps!

### Your Bike is Stolen

1. Report to police at [politi.dk/anmeld](https://politi.dk/anmeld) (online)
2. Check Lost & Found bikes at Nørrebrohallen
3. Search DBA.dk, Facebook Marketplace for your bike
4. File insurance claim if you have bike insurance

### You Get Stopped by Police

Be polite and show:
- Lights (if after dark)
- Bell
- Reflectors
- That you stopped at red lights

Common fines:
- No lights: 700 DKK
- Running red light: 1,000 DKK
- Cycling on sidewalk: 700 DKK
- Phone in hand while cycling: 1,000 DKK

### You Have an Accident

1. Move to safe area if possible
2. Call 112 for emergencies
3. Exchange info with other party
4. Take photos of scene/damage
5. Report to police if injuries or significant damage
6. Contact your insurance

## 🎯 Cultural Unwritten Rules

### Do:
- ✅ Ring your bell when passing pedestrians in bike lane
- ✅ Make room for faster cyclists to pass
- ✅ Pull to the side before stopping (don't block the lane)
- ✅ Stack your bike neatly in crowded bike parking
- ✅ Wave "thanks" when someone lets you pass

### Don't:
- ❌ Walk in the bike lane (you'll get yelled at!)
- ❌ Stop suddenly without pulling over
- ❌ Cycle two-abreast during rush hour
- ❌ Leave your bike in the middle of the sidewalk
- ❌ Use phone while cycling (illegal + dangerous)

### Rush Hour Etiquette (7:30-9:00, 16:00-18:00)

- **Keep pace** - Flow is fast, everyone's commuting
- **Stay predictable** - No sudden moves
- **Pass on the left** - Faster traffic on left, slower on right
- **Don't slow down to use your phone** - Pull over completely

## 🛠️ Maintenance Basics

### Weekly Checks
- Tire pressure (prevents flats!)
- Brake function
- Lights working
- Chain isn't too rusty

### Monthly
- Oil the chain (especially after rain)
- Check brake pads
- Tighten loose bolts

### Annually
- Full service at bike shop (300-800 DKK)
- Replace brake pads/cables if needed
- True (straighten) wheels if wobbly

## 📱 Essential Apps & Resources

**Apps:**
- **CYKEL** - Your AI cycling companion 🚴
- **Rejseplanen** - Public transport journey planner
- **DMI** - Danish weather (very important!)
- **Too Good To Go** - Cheap food (fuel for cycling!)

**Websites:**
- **[cyklistforbundet.dk](https://cyklistforbundet.dk)** - Danish Cycling Federation (English section)
- **[copenhagenize.eu](https://copenhagenize.eu)** - Cycling culture & events
- **[dba.dk](https://dba.dk)** - Buy/sell used bikes & parts

**Emergency Numbers:**
- **112** - Emergency services
- **114** - Police (non-emergency)
- **1813** - Medical helpline (non-emergency)

## 🎉 Your Action Plan for Week 1

### Day 1-2: Get Set Up
- [ ] Buy or rent a bike
- [ ] Get two good locks
- [ ] Check lights and bell work
- [ ] Install CYKEL app for navigation

### Day 3-4: Practice Basics
- [ ] Find your nearest bike lane
- [ ] Practice hand signals in quiet area
- [ ] Learn your commute route
- [ ] Find bike parking near home/work

### Day 5-6: Build Confidence
- [ ] Ride during off-peak hours
- [ ] Practice signaling at real intersections
- [ ] Lock your bike in different locations
- [ ] Try a longer route (maybe to grocery store)

### Day 7: You're a Copenhagener! 🎉
- [ ] Ride during rush hour
- [ ] Navigate without GPS
- [ ] Wave "thanks" to fellow cyclists
- [ ] Start exploring Copenhagen by bike!

## 🤝 Join the Community

**Facebook Groups:**
- "Expats in Copenhagen" - 50k+ members
- "Copenhagen Bikes & Gear" - Buy/sell/advice
- "Critical Mass Copenhagen" - Monthly group rides

**Events:**
- **Bike Copenhagen tours** - Free guided rides
- **Critical Mass** - Last Friday of month, 18:00 from Rådhuspladsen
- **Vintage bike market** - Monthly at Øksnehallen

---

## 💡 Final Tips

**The best advice for your first week:**

1. **Start slow** - Don't commute in rush hour on day 1
2. **Stay visible** - Good lights + bright clothes = safer
3. **Be predictable** - Signal everything, check before changing lanes
4. **Respect the culture** - Cycling is serious business here
5. **Enjoy it!** - This is the best way to experience Copenhagen

**Remember:** Every cyclist in Copenhagen was new once. Danes are generally patient with beginners who follow the rules and signal clearly.

Welcome to the cycling capital of the world! 🚴‍♀️🇩🇰

---

**Need help?** Reach out to the CYKEL community in the app or visit our Help Center for more guides on route planning, bike maintenance, and exploring Copenhagen by bike.

*Last updated: April 2026*
`
};

// Additional Guides
const guides = [
  firstWeekGuide,
  {
    title: "Danish Cycling Laws & Rules",
    category: "cyclingLaws",
    summary: "Complete guide to cycling laws in Denmark with fines, requirements, and safety rules - strictly enforced!",
    difficulty: "beginner",
    readTimeMinutes: 8,
    language: "en",
    tags: ["laws", "rules", "fines", "legal", "safety"],
    isPinned: true,
    author: "CYKEL Team",
    viewCount: 0,
    helpfulCount: 0,
    relatedGuides: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    content: `# Danish Cycling Laws & Rules 🚦

**⚠️ Important:** Danish cycling laws are strictly enforced. Fines range from 700-1,500 DKK and police regularly stop cyclists. Know these rules!

---

## 🔴 CRITICAL RULES (With Fines)

These rules are strictly enforced with substantial fines. Police frequently check for these violations.

### 1. Bike Lights Required After Dark
**Fine: 700 DKK (~$100)**

You must use a white front light and red rear light from sunset to sunrise and during poor visibility.

**Examples:**
- ✅ White light in front, red in back
- ✅ Lights must be visible from distance
- ✅ Required in rain, fog, and darkness
- ❌ Reflectors alone are not enough

**Where to buy:** Any bike shop, supermarkets, or gas stations. USB-rechargeable lights cost 100-300 DKK.

---

### 2. No Phone Use While Cycling
**Fine: 1,000 DKK (~$145)**

Holding or using a phone while cycling is illegal. Use hands-free devices if necessary.

**Examples:**
- ❌ No texting while riding
- ❌ No holding phone to ear
- ❌ No checking maps in hand
- ✅ Bluetooth or mounted phone allowed

**Pro tip:** Install a phone mount on your handlebars and use voice navigation.

---

### 3. Must Stop at Red Lights
**Fine: 1,000 DKK (~$145)**

Cyclists must fully stop at red lights, including pedestrian crossings.

**Examples:**
- ✅ Stop completely at red lights
- ❌ Do not roll through slowly
- ✅ Respect pedestrian crossings
- ✅ Wait behind the stop line

**Cultural note:** Unlike some countries, everyone actually stops at red lights in Copenhagen. Running one will earn you angry looks from locals!

---

### 4. No Cycling on Sidewalks
**Fine: 700 DKK (~$100)**

Cycling on sidewalks is prohibited unless clearly marked as a shared path.

**Examples:**
- ✅ Use bike lanes whenever available
- ✅ Dismount and walk if needed
- ⚠️ Children under 6 may cycle on sidewalks
- ✅ Shared paths are clearly marked with signs

**Where to ride:** Use the blue-marked bike lanes on the right side of the road, between the sidewalk and car lane.

---

### 5. Bike Must Have Working Brakes
**Fine: 700 DKK (~$100)**

Your bike must have functioning brakes on both wheels at all times.

**Examples:**
- ✅ Front and rear brakes required
- ✅ Test brakes before riding
- ⚠️ Even fixie bikes must have brakes
- ❌ Unsafe bikes can be fined on the spot

**Safety check:** Test your brakes every morning before riding, especially if your bike has been parked outside.

---

## 🟡 WARNING RULES (Best Practices)

These aren't always fined but are essential for safety and fitting in with local cycling culture.

### 6. Use Hand Signals for Turns
Cyclists should signal turns clearly using hand signals to communicate with others.

**How to signal:**
- **Left turn:** Extend left arm horizontally
- **Right turn:** Extend right arm horizontally  
- **Stopping:** Raise your hand (either arm) straight up
- ⚠️ Signal early before turning (at least 5 meters ahead)

**Cultural note:** Danish cyclists are famous for their clear hand signals. Not signaling marks you as a tourist!

---

### 7. Keep Right in Bike Lane
Always ride on the right side of the bike lane to allow others to overtake safely.

**Examples:**
- ✅ Overtake on the left
- ❌ Do not block the lane by riding in the middle
- ✅ Keep steady direction
- ❌ Avoid zig-zag riding

**Rush hour rule:** During peak times (7:30-9:00, 16:00-18:00), stay predictable. Copenhageners commute fast!

---

### 8. Right-of-Way at Intersections
Vehicles and cyclists coming from the right have priority unless signs indicate otherwise.

**Examples:**
- ⚠️ Check right before crossing
- ✅ Yield when required
- ❌ Do not assume priority
- ⚠️ Watch for cars turning right (they must yield to you, but stay alert!)

**Golden rule:** Even when you have right-of-way, make eye contact with drivers!

---

### 9. Cycling While Impaired
Cycling while impaired is illegal if you cannot ride safely. There is no fixed BAC limit for mild impairment.

**What you need to know:**
- ⚠️ Stay in control at all times
- ❌ Avoid cycling when drunk (can be fined if riding unsafely)
- ✅ Walk your bike if unsure
- 🚨 Police may intervene if you're riding dangerously

**Serious offenses:** Over 0.08% BAC can result in fines of 1,500-10,000 DKK plus criminal charges.

---

### 10. Watch for Opening Car Doors
Parked cars can open doors suddenly. Maintain distance when riding near parked vehicles.

**Examples:**
- ✅ Keep safe distance from parked cars (1 meter recommended)
- ⚠️ Look ahead for drivers in parked cars
- ⚠️ Be cautious in narrow streets
- 📊 Dooring is one of the most common cycling accidents

**Pro tip:** Look for cars with people sitting inside - they may open doors without checking.

---

### 11. Slippery Surfaces: Tram Tracks & Wet Metal
Metal surfaces like tram tracks become very slippery, especially in rain.

**Examples:**
- ✅ Cross tram tracks at an angle (ideally 90°)
- ❌ Avoid braking on metal surfaces or painted markings
- ⚠️ Slow down significantly in rain
- ⚠️ Watch painted road markings (zebra crossings, bike symbols) - very slippery when wet!

**Accident hot spots:** Nørrebrogade tram tracks, metal grates near Nyhavn, painted crossings everywhere.

---

## ⚪ INFO RULES (Good to Know)

These aren't rules per se, but important information about cycling in Copenhagen.

### 12. No Official Speed Limit for Bikes
There is no fixed speed limit for bicycles, but cyclists must ride safely and adapt to traffic conditions.

**Examples:**
- ✅ Match speed of traffic flow
- ✅ Slow down in crowded areas and near intersections
- ⚠️ Be careful near schools and playgrounds
- ⚠️ E-bikes with motors are limited to 25 km/h assistance

**Cultural speed:** Most Copenhagen commuters ride at 15-20 km/h. Racing cyclists may go 25-30 km/h.

---

### 13. Green Wave Traffic Lights
Some streets synchronize traffic lights for cyclists at around 20 km/h for smooth, uninterrupted riding.

**How it works:**
- ✅ Maintain steady pace of ~20 km/h
- ✅ You'll hit green lights continuously
- ❌ Do not sprint between lights (you'll just wait at the next one)
- 📍 Common on: Nørrebrogade, Amagerbrogade, HC Andersens Boulevard

**Pro tip:** Look for small countdown timers on some traffic lights showing when it will turn green.

---

### 14. Bike Parking Restrictions
Some areas have time limits for parking, and abandoned bikes may be removed by the city.

**Examples:**
- ⚠️ Check local parking signs for time restrictions
- ❌ Do not leave bikes for weeks in the same spot
- ✅ Use designated bike racks (cykelstativer)
- ⚠️ Train stations (like Nørreport, Central Station) often have 2-week limits

**Bike removal:** The city removes bikes with tags asking owners to move them. If not moved within 14 days, they're taken to Nørrebrohallen.

---

### 15. Reflective Gear Recommended
Reflective clothing is not required by law but drastically improves visibility, especially in winter.

**Examples:**
- ✅ Wear reflective vest or arm/leg bands
- ✅ Use lights even during dusk (before it's fully dark)
- ✅ Bright colors improve safety
- ⚠️ Extra important in rain and darkness (Copenhagen is dark 16+ hours in winter!)

**Where to buy:** Tiger, Flying Tiger, sports stores. Reflective vests cost 30-100 DKK.

---

## 📊 Fine Summary Table

| Violation | Fine (DKK) | Fine (USD) |
|-----------|------------|------------|
| No lights after dark | 700 | ~$100 |
| Running red light | 1,000 | ~$145 |
| Phone in hand while cycling | 1,000 | ~$145 |
| Cycling on sidewalk | 700 | ~$100 |
| No working brakes | 700 | ~$100 |
| No bell | 500 | ~$70 |
| Cycling drunk (>0.08% BAC) | 1,500-10,000+ | ~$215-1,450+ |
| Carrying adult passenger improperly | 700 | ~$100 |

**Payment:** Fines must be paid within 14 days. Failure to pay results in increased fines and potential court summons.

---

## 🚨 What If You Get Stopped by Police?

### Stay Calm and Polite

1. **Stop immediately** when signaled
2. **Be polite and cooperative** - Danish police are generally friendly
3. **Show ID** if requested (passport or residence permit)
4. **They will check:**
   - Lights (if after dark or poor weather)
   - Bell functionality
   - Brake function
   - Whether you stopped at recent red lights

### Common Inspection Checks

**Quick roadside test:**
- Ring your bell for them
- Demonstrate both brakes work
- Turn on front and rear lights
- Show reflectors are present

**If you're fined:**
- You'll receive a ticket (bøde) on the spot
- Payment instructions will be provided
- You can contest it, but it's rarely successful if you were actually violating the rule

---

## 🎯 Pro Tips for Staying Legal

### Daily Checklist
Before each ride, quickly check:
- ✅ Lights charged (if rechargeable) or batteries fresh
- ✅ Brakes respond when squeezed  
- ✅ Bell makes a clear sound
- ✅ Tires have air (low tires = harder to brake)

### Invest in Quality Equipment
- **Good lights (200-400 DKK):** Last longer, brighter, more visible
- **Sturdy locks (400-800 DKK):** Prevent bike theft (30,000 bikes stolen/year!)
- **Helmet (300-800 DKK):** Not required, but recommended for safety

### Learn the Pattern
Police enforcement tends to focus on:
- **Time:** Early mornings and late afternoons (rush hour)
- **Locations:** Nørrebro, Vesterbro, near Central Station, Nørreport
- **Violations:** Phone use, running red lights, no lights after dark

---

## 📱 Report Dangerous Cycling

If you see extremely dangerous cycling (wrong way on bike path, drunk cycling endangering others):
- **Non-emergency police:** Call 114
- **Email:** politi.dk has reporting forms
- **Twitter:** @KobenhavnPoliti

---

## 🌍 Compared to Other Countries

### Stricter Than
- Netherlands (more relaxed about phone use)
- UK (lights not always enforced)
- US (varies widely by state)

### Similar To
- Germany (equally strict)
- Switzerland (similarly enforced)

### Key Difference
**Everyone follows the rules in Copenhagen!** Unlike some bike-friendly cities where rules are guidelines, Danes actually stop at reds, use lights, and signal. Follow their lead.

---

## ✅ Final Checklist: Am I Legal?

**Before your next ride, make sure:**
- ✅ My bike has white front light + red rear light (and they work!)
- ✅ My bike has a working bell
- ✅ My bike has reflectors: white front, red rear, yellow on pedals and wheels
- ✅ Both my brakes work properly (test them!)
- ✅ I know basic hand signals (left, right, stop)
- ✅ I have a plan to avoid phone use while cycling
- ✅ I know the major fines (700-1,000 DKK for most violations)
- ✅ I'm ready to stop at ALL red lights (no exceptions!)

**If you answered YES to all, you're ready to ride legally in Copenhagen! 🎉🚴**

---

*Last updated: April 2026*
*Source: Danish Road Traffic Act (Færdselsloven) + Copenhagen Police guidelines*`
  },
  {
    title: "Essential Safety Equipment for Copenhagen Cyclists",
    category: "safety",
    summary: "The essential gear you need to cycle safely and legally in Copenhagen, including lights, brakes, and visibility tips.",
    difficulty: "beginner",
    readTimeMinutes: 6,
    language: "en",
    tags: ["safety", "equipment", "lights", "beginner"],
    isPinned: true,
    author: "CYKEL Team",
    viewCount: 0,
    helpfulCount: 0,
    relatedGuides: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    content: `# Essential Safety Equipment for Copenhagen Cyclists 🛡️🚴

## Quick Summary
✅ Lights are mandatory at night (700 DKK fine if missing!)  
✅ Brakes must work at all times (700 DKK fine if broken)  
✅ Visibility is key for safety  
✅ Helmets are optional but recommended  
✅ Good locks prevent theft (30,000 bikes stolen yearly!)

---

## Why This Matters

Copenhagen is one of the safest cycling cities in the world — but only because cyclists follow rules and stay visible.

**Most accidents happen due to:**
- Poor visibility (especially in winter darkness)
- Lack of awareness (drivers not seeing cyclists)
- Equipment failure (brake failure, flat tires)

**Having the right gear reduces risk by 70%!**

---

## 🔦 1. Lights (Legally Required)

### What the Law Requires

**You MUST have:**
- **White or yellow front light**
- **Red rear light**

**Lights are required:**
- From sunset to sunrise (Oct-March: ~16:00-08:00)
- In rain, fog, or low visibility during daytime
- In tunnels and underpasses

**Fine if missing: 700 DKK (~$100)**

---

### Types of Lights

**Dynamo Lights (Built-in):**
- ✅ Never forget them
- ✅ No batteries needed
- ✅ Always work when you pedal
- ❌ Don't work when stopped
- Cost: Usually included with bike purchase

**Battery-Powered Lights:**
- ✅ Work when stopped
- ✅ Easy to install/remove
- ✅ Can take home to prevent theft
- ❌ Need charging/battery changes
- Cost: 100-400 DKK per set

**USB Rechargeable (Recommended for Expats):**
- Best of both worlds
- Charge via USB cable
- Last 3-10 hours per charge
- Popular brands: Knog, Cateye, Exposure
- Cost: 200-600 DKK for quality set

---

### Light Brightness Guide

**Front Light:**
- Minimum: 100 lumens (legal requirement)
- Recommended: 200-500 lumens (better visibility)
- For unlit paths: 500+ lumens

**Rear Light:**
- Minimum: 50 lumens
- Recommended: 100+ lumens
- Flashing or steady both allowed

**Pro Tip:** Buy lights that are visible from 300 meters - that's what police check!

---

### Common Light Mistakes

❌ **Only using front light** (you need both!)  
❌ **Lights not charged** (carry spare batteries or power bank)  
❌ **Flashing too fast** (some people find very fast flashing hard to judge distance)  
❌ **Lights pointed wrong** (front should aim slightly down, not blind oncoming cyclists)  
❌ **Forgetting during dusk** (turn on lights 30min before sunset)

---

## 🛑 2. Brakes (Critical for Safety & Legally Required)

### What You Need

**Your bike MUST have:**
- **Working front brake**
- **Working rear brake**

**Fine if brakes don't work: 700 DKK (~$100)**

Police can test your brakes on the spot and issue fines if they're not working properly!

---

### Types of Brakes in Copenhagen

**Coaster Brake (Back-pedal brake):**
- Very common on Danish bikes
- Brake by pedaling backward
- ✅ Low maintenance
- ✅ Works in rain
- ❌ Can't coast while braking
- ❌ Harder to control on ice

**Hand Brakes (Rim brakes):**
- Standard on most bikes
- Squeeze handle to brake
- ✅ Better control
- ✅ Can brake one wheel at a time
- ❌ Less effective in rain
- ❌ Need regular adjustment

**Disc Brakes:**
- Increasingly common on new bikes
- ✅ Best performance in all weather
- ✅ Strong and consistent
- ❌ More expensive to repair
- ❌ Less common on budget bikes

---

### Weekly Brake Check

**Test EVERY week (takes 30 seconds!):**

1. **Front brake test:**
   - Roll forward slowly
   - Squeeze front brake
   - Front wheel should stop completely

2. **Rear brake test:**
   - Roll forward slowly  
   - Apply rear brake (hand or coaster)
   - Rear wheel should stop completely

3. **Listen for:**
   - Squealing = worn pads
   - Grinding = serious problem, stop riding!
   - Loose cables = get it fixed immediately

**If brakes feel soft or spongy → GO TO BIKE SHOP IMMEDIATELY**

---

## 👁️ 3. Visibility Equipment (Often Ignored, Can Save Your Life!)

### Why Visibility Matters in Copenhagen

**Denmark in winter:**
- Sun rises: ~08:30
- Sun sets: ~15:30
- **You'll cycle in darkness 16+ hours per day!**

**Accident statistics:**
- 60% of cyclist accidents happen in low-light conditions
- Most involve cars not seeing the cyclist
- Reflective gear reduces accident risk by 47%

---

### Essential Visibility Gear

**Reflectors (Required on All Bikes):**
- Front: White reflector
- Rear: Red reflector  
- Pedals: Yellow reflectors (both sides of each pedal)
- Wheels: Yellow reflectors or reflective tire strips

**Reflective Clothing (Not Required, But Smart):**

**Minimum:**
- Reflective ankle bands (50-100 DKK)
- Moving reflectors (on legs) are MORE visible than static ones

**Better:**
- Reflective vest (60-150 DKK)
- Reflective backpack cover

**Best:**
- Reflective jacket with 360° visibility
- Reflective rain gear

**Where to buy:** Tiger, Flying Tiger, Føtex, sports stores

---

### Color Matters

**Most Visible Colors:**
1. **Fluorescent yellow/green** (daytime)
2. **White** (nighttime with lights)
3. **Orange** (both day and night)

**Least Visible:**
- Black (very common in Copenhagen fashion, but dangerous!)
- Dark blue
- Brown

**Copenhagen Fashion Hack:** Wear black, but add reflective accessories (bands, vest, backpack)

---

## 🪖 4. Helmet (Optional in Denmark, But...)

### The Law

**Helmets are NOT required by law in Denmark for adults.**

(However, they ARE required for children in some other EU countries, and many Danish parents have their kids wear them)

---

### Should You Wear One?

**Consider wearing a helmet if:**
- ✅ You're new to cycling in traffic
- ✅ You ride on busy streets during rush hour
- ✅ You have kids in a bike seat (set good example)
- ✅ You ride fast (>25 km/h)
- ✅ You ride in icy conditions
- ✅ You mountain bike or do sport cycling

**Many Copenhageners don't wear helmets because:**
- Infrastructure is very safe here
- Slow city cycling (15-20 km/h)
- Cultural norm

**It's your choice!** Don't feel pressured either way.

---

### If You Do Wear a Helmet

**Get one that:**
- Fits snugly (shouldn't move when you shake your head)
- Has CE certification
- Is brightly colored (more visible)
- Has reflective strips

**Cost:** 200-800 DKK

**Where to buy:** Bike shops, Intersport, Stadium

---

## 🔒 5. Bike Lock (Essential in Copenhagen!)

### The Theft Problem

**Copenhagen bike theft statistics:**
- ~30,000 bikes stolen per year
- Only 10% are recovered
- High-theft areas: Nørrebro, Vesterbro, Central Station, Nørreport

**Your bike WILL get stolen if you use a cheap lock!**

---

### The Two-Lock Rule

**Always use TWO locks of different types:**

1. **U-Lock (Bøjlelås):**
   - Through frame + rear wheel + fixed object
   - Very hard to cut
   - Cost: 300-800 DKK
   - Brands: Abus, Kryptonite, OnGuard

2. **Chain Lock or Cable Lock:**
   - Through front wheel + frame
   - Prevents wheel theft
   - Cost: 200-500 DKK

**Total investment:** 500-1,300 DKK  
**Cost of stolen bike:** 2,000-8,000 DKK (if bought new)

**Math is simple: buy good locks!**

---

### Locking Technique

**Step 1:** Find a fixed, sturdy object
- Bike racks (best)
- Sign posts (ok)
- Railings (ok)
- NOT trees, benches, or temporary fences

**Step 2:** U-lock position
- Through rear triangle of frame
- Through rear wheel
- Around fixed object
- Lock should be tight (no space for leverage tools)

**Step 3:** Chain/cable position
- Through front wheel
- Through frame
- Keep lock off the ground (harder to smash)

**Step 4:** Hide quick-release parts
- Turn quick-release levers inward
- Consider removing seat if long-term parking

---

### High-Theft Areas

**Be EXTRA careful at:**
- Copenhagen Central Station (train station)
- Nørreport Station
- Metro stations
- Nørrebro (especially at night)
- Vesterbro bars/nightlife areas
- University buildings

**Never leave your bike overnight in same spot!**

---

## 🚲 6. Basic Bike Setup & Maintenance

### Tires & Pressure

**Check weekly:**
- Tire pressure (squeeze with thumb - should be firm)
- Low pressure = harder to control, more flats
- Pump tires at gas stations (free air) or buy pump (150-300 DKK)

**Proper pressure:**
- Road bikes: Higher pressure (firm when squeezed)
- City bikes: Medium pressure (slight give)
- Check sidewall of tire for PSI/bar recommendation

**Tire condition:**
- Look for cracks, worn tread
- Replace if threads showing through
- Cost: 100-250 DKK per tire

---

### Seat Height (Critical for Control!)

**Proper height test:**
- Sit on bike
- Put heel on pedal (at lowest point)
- Leg should be almost straight
- When cycling (ball of foot on pedal), slight knee bend

**Too low = less power, knee pain**  
**Too high = dangerous, can't stop properly**

---

### Weekly 30-Second Safety Check

✅ **Squeeze brakes** - both work?  
✅ **Spin wheels** - any wobble?  
✅ **Check tires** - properly inflated?  
✅ **Test lights** - both working?  
✅ **Ring bell** - can you hear it?  
✅ **Wiggle handlebars** - tight and secure?

**If anything fails → go to bike shop before riding!**

---

## ❌ Common Safety Mistakes

### Mistake #1: "I'll Just Ride Without Lights Real Quick"
**Why it's dangerous:**
- Police actively look for this (easy fine to issue)
- Drivers genuinely can't see you
- Twilight (dusk) is especially dangerous

**Fix:** Keep spare battery lights in your bag always

---

### Mistake #2: Ignoring Brake Maintenance
**Why it's dangerous:**
- Brakes degrade slowly - you don't notice until emergency
- Wet weather makes bad brakes worse
- Can't stop at red lights properly

**Fix:** Monthly brake check, annual service

---

### Mistake #3: Wearing All-Black in Winter
**Why it's dangerous:**
- Car drivers literally can't see you
- Especially bad in rain
- Danish winter is dark 16+ hours per day

**Fix:** Add ONE reflective item (vest, bands, or backpack)

---

### Mistake #4: Using Cheap Locks
**Why it's bad:**
- Thieves can cut cable locks in 3 seconds with bolt cutters
- Your 3,000 DKK bike is gone forever
- Insurance may not cover if you used inadequate lock

**Fix:** Invest 500-1,000 DKK in proper locks once

---

### Mistake #5: Not Testing Setup Before Long Ride
**Why it's risky:**
- Finding broken brakes mid-ride is scary
- Flat tire with no pump = walking bike home
- Dead lights after sunset = fine + dangerous ride

**Fix:** 30-second check before each ride

---

## 💡 Pro Tips from Long-Time Copenhagen Cyclists

### Tip #1: Redundancy is Key
- Carry backup lights (small clip-on lights, 50 DKK)
- Keep mini pump or CO₂ cartridges
- Have repair shop number saved in phone

### Tip #2: Make Your Bike Ugly (To Prevent Theft)
- Stickers all over frame
- Duct tape on seat
- Remove brand logos
- "Ugly" bikes don't get stolen as often

### Tip #3: Light Up Like a Christmas Tree
- More lights = more visible = safer
- Wheel lights (100 DKK) look cool and increase visibility
- Spoke reflectors catch car headlights

### Tip #4: Winter = Double the Safety Checks
- Lights fail faster in cold
- Brakes need more maintenance in wet
- Tire pressure drops in cold weather
- Check equipment 2x per week in winter

### Tip #5: Join "Copenhagen Cyclists" Facebook Group
- Ask questions about equipment
- Buy/sell used safety gear
- Get recommendations for bike shops
- Learn from experienced locals

---

## 🛠️ Where to Buy Safety Equipment

### Budget-Friendly:
- **Flying Tiger** - Cheap lights, reflectors (50-150 DKK)
- **Føtex / Bilka** - Basic bike accessories
- **Harald Nyborg** - Tools and basic gear
- **DBA.dk** - Used equipment (check condition!)

### Mid-Range:
- **Jensens Cykler** - Good selection, helpful staff
- **Bikes.dk** - Quality equipment
- **Intersport / Stadium** - Sporting goods

### Premium (If You Cycle Daily):
- **Cykelmageren** - High-end lights and gear
- **Bike Shop specializing in commuter gear**
- **Online:** bike-components.dk, cykelpartner.dk

---

## 📋 Essential Safety Checklist

**Before you ride in Copenhagen, make sure you have:**

✅ Front white light (working and charged)  
✅ Rear red light (working and charged)  
✅ Both brakes working perfectly  
✅ Reflectors (front, rear, pedals, wheels)  
✅ At minimum: one reflective item (vest, bands, or bright clothing)  
✅ Strong U-lock + secondary lock  
✅ Properly inflated tires  
✅ Correct seat height  
✅ Working bell  
✅ Emergency contact saved in phone (bike shops, Falck roadside: 70 10 20 30)

**Optional but recommended:**
- Helmet
- Spare lights
- Mini repair kit
- Bike insurance (check home insurance first - often included!)

---

## 🚨 What to Do in Emergencies

### Brake Failure
1. **Don't panic**
2. Use your feet to slow down (drag feet on ground)
3. Steer to safe area
4. Walk bike to nearest repair shop
5. **Emergency repair:** Baisikeli (Nørrebro), Andersens Cykler (Vesterbro)

### Flat Tire
1. Walk bike to air pump (many metro stations have free pumps)
2. If tire won't hold air = puncture
3. Walk to nearest bike shop (most fix flats for 50-150 DKK same-day)
4. **24/7 option:** Call Falck bike assistance: 70 10 20 30

### Lights Die After Sunset
1. **Temporary fix:** Use phone flashlight (held steady, not in hand while riding!)
2. Walk bike on sidewalk (pushing bike on sidewalk is allowed)
3. Buy emergency lights at nearest gas station or 7-Eleven
4. **Never risk riding without lights in dark!**

### Lost Keys to Lock
1. **Don't attempt to break lock** (looks like theft, police may stop you)
2. Call locksmith or bike shop
3. They can cut lock for 200-500 DKK
4. Bring ID showing you own the bike

---

## 💰 Total Safety Investment (Budget Breakdown)

**Absolute Minimum (Legal + Safe):**
- USB lights (front + rear): 200 DKK
- One U-lock: 300 DKK
- Reflective ankle bands: 50 DKK
- **Total: 550 DKK (~$80)**

**Recommended Setup:**
- Quality USB lights: 400 DKK
- U-lock + chain lock: 700 DKK
- Reflective vest: 100 DKK
- Mini pump: 150 DKK
- Spare batteries/backup lights: 100 DKK
- **Total: 1,450 DKK (~$210)**

**Premium (If You Cycle Daily Year-Round):**
- Bright LED lights (500+ lumens): 800 DKK
- Two premium U-locks: 1,200 DKK
- Reflective jacket: 400 DKK
- Bike insurance: 300 DKK/year
- Helmet: 400 DKK
- Repair kit + tools: 300 DKK
- **Total: 3,400 DKK (~$490)**

**Remember:** This investment lasts years and prevents theft, fines, and accidents!

---

## 🎯 Final Thought

**Good equipment doesn't just make cycling easier — it makes it safer for you and everyone around you.**

Copenhagen's cycling culture works because everyone follows the rules and stays visible. By investing in basic safety gear, you're not just protecting yourself — you're contributing to the safest cycling city in the world.

**Most important:**
✅ Be visible (lights + reflective gear)  
✅ Stay in control (working brakes)  
✅ Protect your investment (good locks)

Welcome to Copenhagen's cycling community! 🚴‍♀️🇩🇰

---

## 📚 Next Steps

**Continue learning:**
- 👉 "Avoiding Common Cycling Accidents in Copenhagen"
- 👉 "Night Cycling Safety in Denmark"
- 👉 "What to Do After a Cycling Accident"
- 👉 "Bike Theft Prevention & Recovery"

**Get help:**
- Copenhagen Cyclists Facebook group
- Bike shops (ask for safety advice - it's free!)
- CYKEL app (real-time navigation + safety features)

---

*Last updated: April 2026*  
*Info sources: Danish Traffic Safety Council, Copenhagen Municipality, Copenhagen Police*`
  },
  {
    title: "Winter Cycling in Copenhagen",
    category: "seasonal",
    summary: "Master Copenhagen's winter cycling with the right equipment, techniques, and safety precautions.",
    difficulty: "intermediate",
    readTimeMinutes: 8,
    language: "en",
    tags: ["winter", "weather", "equipment", "safety"],
    isPinned: false,
    author: "CYKEL Team",
    viewCount: 0,
    helpfulCount: 0,
    relatedGuides: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    content: `# Winter Cycling in Copenhagen ❄️🚴

80% of Copenhagen cyclists continue riding through winter! Here's how to join them safely.

## Essential Equipment

### Tires
**Studded tires (200-600 DKK per tire):**
- Only necessary for ice/hard-packed snow
- Install on front wheel at minimum
- Brands: Schwalbe Marathon Winter, Continental

**Regular tires work fine for:**
- Cleared bike lanes (most of Copenhagen)
- Light snow
- Rain

### Lights
Winter = darkness. You need:
- **Bright front light** (200+ lumens)
- **Bright rear light** (50+ lumens)
- Extra batteries or USB power bank
- Backup lights

### Clothing
**Layer system:**
1. **Base layer** - Moisture-wicking
2. **Mid layer** - Fleece or wool
3. **Outer layer** - Windproof + waterproof

**Key items:**
- Windproof gloves (you'll brake less without them)
- Buff/neck warmer
- Waterproof pants or rain legs
- Warm hat that fits under helmet
- Waterproof jacket with hood

**Pro tip:** You should be slightly cold when you start - you'll warm up!

## Riding Techniques

### On Snow
- Lower tire pressure slightly (better traction)
- Brake early and gently
- No sudden turns
- Keep weight centered

### On Ice
- **Studded tires highly recommended**
- Extra following distance
- Avoid metal plates, painted lines
- Dismount if unsure

### In Rain
- Vision: Clear glasses or none at all
- Braking: Earlier, more gentle
- Clothing: Full rain gear
- Lights: Always on

## Route Planning

### Priority Routes
Copenhagen clears bike lanes in this order:
1. Main commuter routes (C01, C99, etc.)
2. Secondary routes
3. Neighborhood streets

**Check [kk.dk](https://kk.dk) for clearance status.**

### Alternative Routes
In heavy snow:
- Buses allow bikes (space permitting)
- Metro always allows bikes (except rush hour)
- S-train allows bikes (buy ticket)

## Safety Tips

### Visibility
- Reflective vest or strips
- Multiple lights
- Bright colors
- Make eye contact at intersections

### Road Hazards
- **Slushy puddles** - Hide ice underneath
- **Grates and drains** - Super slippery
- **Tram tracks** - Death traps when wet
- **Leaves** - Slippery as ice

### When NOT to Ride
- Heavy snowfall (wait for clearance)
- Ice storm
- Strong wind (>20 m/s)
- You don't feel confident

**There's no shame in taking the metro!**

## Bike Maintenance

### Winter Prep
- Oil chain more frequently (salt causes rust)
- Fenders prevent spray
- Check brakes work in wet
- Quality lights that won't die in cold

### Weekly Winter Checks
- Wipe down frame (remove salt)
- Re-oil chain
- Check tire pressure
- Test lights

### Spring Service
Book full service in April:
- Deep clean
- Replace rusted parts
- True wheels
- Fresh oil/grease

Cost: 400-800 DKK at bike shop

## Emergency Kit

**Keep in your bag:**
- Spare lights
- Phone with charger
- Metro card
- Emergency cash
- Small towel

**On your bike:**
- Good lights
- Bell
- Lock

## The Upside

### Why Winter Cycle?

✅ **Faster than public transport** - No delays, direct route  
✅ **Free workout** - Stay fit without gym  
✅ **No crowds** - Peaceful commute  
✅ **Reliable** - Metro breaks, bikes don't  
✅ **You'll feel amazing** - Fresh air + endorphins

### Join the 80%!

Once you have the right gear and tips, winter cycling is totally doable. Many Copenhageners say they prefer it to summer (no tourists blocking bike lanes!).

---

**Bottom line:** Right equipment + cleared routes + smart riding = Safe winter cycling in Copenhagen!

*Need gear? Check our Bike Shops guide for recommendations.*
`
  },
  {
    title: "10 Things Danes Never Do While Cycling",
    category: "culture",
    summary: "Learn the unwritten cycling rules in Copenhagen so you don't stand out or annoy other cyclists.",
    difficulty: "beginner",
    readTimeMinutes: 5,
    language: "en",
    tags: ["culture", "etiquette", "behavior", "copenhagen"],
    isPinned: true,
    order: 1,
    author: "CYKEL Team",
    viewCount: 0,
    helpfulCount: 0,
    keyPoints: [
      "Cycling culture is based on flow and predictability",
      "Blocking the lane is one of the biggest mistakes",
      "Danes rarely use bells aggressively",
      "Everyone follows traffic rules strictly",
      "Cycling is calm, not competitive"
    ],
    checklist: [
      "Stay on the right side of the bike lane",
      "Signal before turning or stopping",
      "Avoid sudden movements",
      "Do not block others while riding slowly",
      "Respect traffic lights and crossings"
    ],
    relatedGuides: [
      "Rush Hour Etiquette on Bike Lanes",
      "Understanding Bike Lane Markings",
      "Avoiding Common Cycling Accidents"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    content: `# 10 Things Danes Never Do While Cycling

## Quick Summary
- Keep right, always
- Don't block faster cyclists
- Avoid sudden movements
- Follow traffic rules strictly
- Stay calm and predictable

---

## Why This Matters

Cycling in Copenhagen works so well because everyone follows the same unwritten rules.

It's not just about laws — it's about **behavior and respect**.

If you understand these habits, you will immediately feel more comfortable and confident.

---

## 1. They Don't Block the Bike Lane

One of the biggest mistakes beginners make is riding in the middle of the lane.

### What locals do:
- Stay to the right
- Leave space for others to pass

Blocking the lane during busy hours is frustrating and unsafe.

---

## 2. They Don't Stop Suddenly

Sudden stops are dangerous in Copenhagen's busy bike traffic.

### Always:
- Signal before stopping
- Move slightly to the right if possible

---

## 3. They Don't Ignore Traffic Lights

Cyclists follow traffic lights just like cars.

Running red lights is:
- Illegal
- Socially unacceptable

---

## 4. They Don't Use Their Phone While Riding

Using your phone:
- Is illegal
- Disrupts flow
- Causes accidents

---

## 5. They Don't Ride on Sidewalks

Sidewalks are for pedestrians.

If you ride there:
- People will notice immediately
- It's considered wrong (and illegal)

---

## 6. They Don't Ride Aggressively

Cycling culture is calm.

You won't see:
- Racing behavior
- Aggressive overtaking
- Sudden weaving

---

## 7. They Don't Overuse the Bell

The bell is used only when necessary.

### Good etiquette:
- Ring once politely if needed
- Avoid repeated or aggressive ringing

Often, saying "undskyld" (excuse me) works better.

---

## 8. They Don't Ride Unpredictably

Unpredictable riding causes most problems.

Avoid:
- Sudden turns
- Zig-zag movement
- Changing lanes without looking

---

## 9. They Don't Ignore Other Cyclists

Cycling is a shared system.

Always:
- Look over your shoulder before moving left
- Be aware of others

---

## 10. They Don't Treat Cycling Like Sport in the City

In Copenhagen:
- Cycling = transport

Not:
- Racing
- Training (in city lanes)

Fast riding is fine — but only if it fits the flow.

---

## Common Mistakes

❌ Riding too slowly in the middle  
❌ Not signaling  
❌ Stopping without warning  
❌ Ignoring flow  

---

## Pro Tips

- Watch locals and copy behavior  
- Stay predictable  
- Keep calm and focused  
- Respect space and flow  

---

## Final Thought

If you follow these simple habits, you won't just cycle — you'll cycle like a local.

And that makes all the difference in Copenhagen.

---

## Next Step

Continue with:
👉 Rush Hour Etiquette on Bike Lanes  
👉 Understanding Bike Lane Markings  
👉 Avoiding Common Cycling Accidents
`
  }
];

// Cycling Rules
const rules = [
  {
    title: "Bike Lights Mandatory After Sunset",
    description: "All bicycles must have a white front light and red rear light from sunset to sunrise and in poor visibility conditions. Lights must be visible from at least 300 meters.",
    severity: "critical",
    fine: 700,
    examples: [
      "White or yellow front light (steady or flashing)",
      "Red rear light (steady or flashing)",
      "Lights required in tunnels",
      "Reflectors alone are NOT sufficient"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Stop at All Red Lights",
    description: "Cyclists must stop at all red traffic lights, including bicycle-specific lights and pedestrian crossings. Running a red light is treated as seriously as driving a car through one.",
    severity: "critical",
    fine: 1000,
    examples: [
      "Red bike traffic lights",
      "Red pedestrian crossing lights",
      "Flashing red lights",
      "No 'Idaho stop' rule in Denmark"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "No Phone in Hand While Cycling",
    description: "It is illegal to hold a mobile phone while cycling. This includes texting, calling, or using apps. You may use a phone holder with voice control.",
    severity: "critical",
    fine: 1000,
    examples: [
      "Texting while riding - illegal",
      "Calling while holding phone - illegal",
      "Using GPS on handlebar mount - legal",
      "Headphones while cycling - legal (but risky)"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Stay Off Sidewalks",
    description: "Cycling on sidewalks is prohibited for riders over 6 years old unless the sidewalk is marked as a shared path. Use bike lanes or the road instead.",
    severity: "warning",
    fine: 700,
    examples: [
      "Sidewalk cycling - illegal",
      "Marked shared paths - legal",
      "Pedestrian zones without bikes - illegal",
      "Children under 6 - exception allowed"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Functioning Bell Required",
    description: "All bicycles must be equipped with a functioning bell or horn that can be heard at a reasonable distance.",
    severity: "warning",
    fine: 500,
    examples: [
      "Traditional bike bell - required",
      "Horn - acceptable alternative",
      "Electronic sound device - acceptable",
      "No bell - will be fined"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Proper Reflectors Required",
    description: "Bicycles must have white front reflector, red rear reflector, yellow pedal reflectors, and yellow wheel reflectors (2 per wheel or reflective tires).",
    severity: "info",
    fine: 0,
    examples: [
      "Front reflector - white",
      "Rear reflector - red",
      "Pedal reflectors - yellow (both sides)",
      "Wheel reflectors - 2 per wheel or reflective tires"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Drunk Cycling Laws",
    description: "Cycling under the influence of alcohol is illegal. With 0.05-0.08% BAC you get a fine. Over 0.08% BAC can result in court prosecution and license points.",
    severity: "critical",
    fine: 1500,
    examples: [
      "0.05% BAC - 1,500 DKK fine",
      "0.08% BAC - Court prosecution",
      "Can lose driver's license (yes, even for cycling)",
      "Police regular checks on weekend nights"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "No Adult Passengers on Regular Bikes",
    description: "Carrying adult passengers on a regular bicycle is illegal. Use designated cargo bikes or bicycle trailers for transporting adults.",
    severity: "warning",
    fine: 700,
    examples: [
      "Adult on rear rack - illegal",
      "Adult on handlebars - illegal",
      "Cargo bike with seats - legal",
      "Bicycle trailer - legal"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Children in Bike Seats Must Be Under 8",
    description: "Children being transported in bike seats must be under 8 years old and the seat must have proper restraints and foot protection. Helmets strongly recommended but not required.",
    severity: "info",
    fine: 0,
    examples: [
      "Approved child seat with restraints",
      "Foot protection required",
      "Child must be under 8 years",
      "Helmet recommended (not mandatory)"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Signal Your Turns",
    description: "While not strictly enforced with fines, signaling turns is part of Danish traffic culture and expected. Use clear hand signals to indicate turns and stops.",
    severity: "info",
    fine: 0,
    examples: [
      "Left turn - left arm extended",
      "Right turn - right arm extended",
      "Stopping - hand raised up",
      "Signal at least 5 meters before turning"
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Quick Tips
const quickTips = [
  {
    title: "Always keep right in bike lanes",
    description: "Faster cyclists will pass on your left. Blocking the lane frustrates everyone!",
    category: "culture",
    icon: "➡️",
    priority: 10,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Get lights before dark - 700 DKK fine",
    description: "White front, red back. Police check regularly at sunset. Available at any supermarket.",
    category: "safety",
    icon: "💡",
    priority: 9,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Hand signals are mandatory",
    description: "Left arm out for left turn, right arm out for right turn, hand up for stopping.",
    category: "cyclingLaws",
    icon: "👋",
    priority: 8,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Never use phone while cycling",
    description: "1,000 DKK fine. Use a handlebar mount and voice control instead.",
    category: "cyclingLaws",
    icon: "📱",
    priority: 9,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Signal before stopping",
    description: "Sudden stops cause accidents. Raise your hand and move slightly right first.",
    category: "safety",
    icon: "🛑",
    priority: 7,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Use two locks minimum",
    description: "Frame lock + chain/U-lock. Copenhagen has 10,000+ bike thefts yearly.",
    category: "safety",
    icon: "🔒",
    priority: 8,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Bike lanes are one-way only",
    description: "Going the wrong way is illegal and dangerous - you'll face oncoming traffic!",
    category: "cyclingLaws",
    icon: "⬆️",
    priority: 7,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Red lights = full stop",
    description: "No 'rolling through' allowed. Treated same as cars - 1,000 DKK fine.",
    category: "cyclingLaws",
    icon: "🚦",
    priority: 9,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Check your brakes weekly",
    description: "Wet weather reduces brake power by 50%. Test them before every ride in rain.",
    category: "safety",
    icon: "🛠️",
    priority: 6,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Stay calm - cycling isn't a race",
    description: "Copenhagen cycling culture values flow and predictability, not speed.",
    category: "culture",
    icon: "😌",
    priority: 6,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Ring bell politely once",
    description: "Aggressive or repeated ringing is frowned upon. Often 'undskyld' works better.",
    category: "culture",
    icon: "🔔",
    priority: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Winter = priority bike lane clearing",
    description: "Many lanes cleared before roads! Just get spiked tires and good lights.",
    category: "weather",
    icon: "❄️",
    priority: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Look over shoulder before turning",
    description: "Fast cyclists come up quickly. Always check before moving left.",
    category: "safety",
    icon: "👀",
    priority: 7,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Sidewalks = pedestrians only",
    description: "Riding on sidewalks is illegal and noticed immediately. Use the road if no bike lane.",
    category: "cyclingLaws",
    icon: "🚶",
    priority: 6,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    title: "Budget 150 DKK/month for maintenance",
    description: "Regular care prevents expensive repairs. Danish Red Cross has affordable service.",
    category: "maintenance",
    icon: "💰",
    priority: 4,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Emergency Contacts
const emergencyContacts = [
  {
    name: "Danish Emergency Services",
    type: "medical",
    phoneNumber: "112",
    description: "Call for all life-threatening emergencies including accidents, medical emergencies, fires, and crimes in progress. Free from all phones, available 24/7 with English-speaking operators.",
    isAvailable24x7: true,
    languages: ["da", "en", "de"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Medical Helpline (Non-Emergency)",
    type: "medical",
    phoneNumber: "1813",
    description: "For non-life-threatening medical issues and advice. Nurses provide guidance and can schedule emergency appointments if needed. Available 24/7.",
    isAvailable24x7: true,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Police (Non-Emergency)",
    type: "police",
    phoneNumber: "114",
    description: "For reporting non-emergency crimes like bike theft, vandalism, or if you need police assistance but it's not urgent. Available 24/7.",
    isAvailable24x7: true,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Poison Emergency",
    type: "medical",
    phoneNumber: "82 12 12 12",
    description: "24/7 poison emergency hotline for cases of ingestion of toxic substances, chemicals, medications, or suspicious foods.",
    isAvailable24x7: true,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Bike Breakdown - Falck",
    type: "service",
    phoneNumber: "70 10 20 30",
    description: "Falck roadside assistance for bicycles (membership required). Can help with flat tires, broken chains, or transport you and your bike home.",
    isAvailable24x7: true,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Copenhagen Municipality (Bike Infrastructure Issues)",
    type: "service",
    phoneNumber: "33 66 33 66",
    description: "Report issues with bike lanes, dangerous potholes, broken bike signals, or other cycling infrastructure problems. Monday-Friday 8:00-16:00.",
    isAvailable24x7: false,
    languages: ["da"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Lost Property - Copenhagen (Hittegodskontoret)",
    type: "service",
    phoneNumber: "38 74 88 22",
    description: "Report or search for lost items including lost bikes. Items found by police or public transport are kept here. Monday-Friday 10:00-17:30.",
    isAvailable24x7: false,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "International Emergency Assistance",
    type: "medical",
    phoneNumber: "+45 70 13 00 41",
    description: "SOS International provides emergency assistance for foreigners and tourists in Denmark. Can help with medical emergencies, repatriation, and insurance claims.",
    isAvailable24x7: true,
    languages: ["en", "da", "de", "fr", "es"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Danish Red Cross Bike Repair Service",
    type: "service",
    phoneNumber: "35 25 92 00",
    description: "Affordable bike repair service for those on a budget. Call to book appointment at their workshop. Monday-Friday 10:00-16:00.",
    isAvailable24x7: false,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Dental Emergency Service",
    type: "medical",
    phoneNumber: "35 38 02 51",
    description: "Emergency dental care for severe toothaches, knocked-out teeth, or dental trauma. Copenhagen dental emergency clinic. Evenings, nights, and weekends.",
    isAvailable24x7: false,
    languages: ["da", "en"],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seedData() {
  console.log('🌱 Starting Expat Hub data seeding...\n');

  try {
    // Seed Guides
    console.log('📚 Seeding Expat Guides...');
    const guidesCollection = db.collection('expatGuides');
    for (const guide of guides) {
      const docRef = await guidesCollection.add(guide);
      console.log(`  ✅ Added guide: "${guide.title}" (ID: ${docRef.id})`);
    }

    // Seed Cycling Rules
    console.log('\n⚖️  Seeding Cycling Rules...');
    const rulesCollection = db.collection('cyclingRules');
    for (const rule of rules) {
      const docRef = await rulesCollection.add(rule);
      console.log(`  ✅ Added rule: "${rule.title}" (Fine: ${rule.fine} DKK)`);
    }

    // Seed Quick Tips
    console.log('\n💡 Seeding Quick Tips...');
    const tipsCollection = db.collection('quickTips');
    for (const tip of quickTips) {
      const docRef = await tipsCollection.add(tip);
      console.log(`  ✅ Added tip: "${tip.title}"`);
    }

    // Seed Emergency Contacts
    console.log('\n🚨 Seeding Emergency Contacts...');
    const contactsCollection = db.collection('emergencyContacts');
    for (const contact of emergencyContacts) {
      const docRef = await contactsCollection.add(contact);
      console.log(`  ✅ Added contact: "${contact.name}" (${contact.phoneNumber})`);
    }

    console.log('\n\n🎉 SUCCESS! Expat Hub data seeded successfully!\n');
    console.log('Summary:');
    console.log(`  📚 ${guides.length} guides added`);
    console.log(`  ⚖️  ${rules.length} cycling rules added`);
    console.log(`  � ${quickTips.length} quick tips added`);
    console.log(`  �🚨 ${emergencyContacts.length} emergency contacts added`);
    console.log('\n🚴 Open the CYKEL app and check the Expat Hub!\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedData();
