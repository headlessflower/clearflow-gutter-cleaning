import { createClient } from '@supabase/supabase-js'

type ServiceType = 'single_story' | 'two_story' | 'multi_story'
type AddOnKey = 'heavy_debris' | 'difficult_access' | 'gutter_guards' | 'oversized_gutters'

type MaintenancePlan = 'none' | 'seasonal' | 'quarterly'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const firstNames = [
  'Devon', 'Linda', 'Carlos', 'Emily', 'Robert', 'Marcus', 'Sandra', 'Daniel',
  'Sofia', 'Anthony', 'Javier', 'Melissa', 'George', 'Kevin', 'Isabel', 'Tyler',
  'Rachel', 'Victor', 'Olivia', 'Miguel', 'Paul', 'Kimberly', 'Chris', 'Natalie',
  'Ariana', 'Jose', 'Brenda', 'Leo', 'Monica', 'Diana', 'Trevor', 'Vanessa'
]

const lastNames = [
  'Martinez', 'Chen', 'Ramirez', 'Torres', 'Alvarez', 'Lee', 'Lopez', 'Kim',
  'Hernandez', 'Russo', 'Gutierrez', 'Wong', 'Salazar', 'Park', 'Rivera', 'Grant',
  'Stein', 'Maldonado', 'Bennett', 'Soto', 'Harrison', 'Tran', 'Delgado', 'Flores',
  'Morales', 'Castillo', 'Vega', 'Ortega', 'Cruz', 'Navarro'
]

const cities = [
  { city: 'Los Angeles', zip: ['90023', '90026', '90031', '90032', '90033', '90041', '90042', '90065'] },
  { city: 'Pasadena', zip: ['91103', '91104', '91105', '91106', '91107'] },
  { city: 'Arcadia', zip: ['91006', '91007'] },
  { city: 'Monrovia', zip: ['91016'] },
  { city: 'Sierra Madre', zip: ['91024'] },
  { city: 'South Pasadena', zip: ['91030'] },
  { city: 'La Cañada Flintridge', zip: ['91011'] },
  { city: 'Duarte', zip: ['91010'] },
  { city: 'El Monte', zip: ['91731', '91732'] },
  { city: 'La Crescenta', zip: ['91214'] },
  { city: 'Montrose', zip: ['91020'] },
  { city: 'San Gabriel', zip: ['91775', '91776'] },
  { city: 'Temple City', zip: ['91780'] },
]

const streets = [
  'Oak Grove Dr', 'Maple Ave', 'Alta Vista Dr', 'York Blvd', 'Figueroa St',
  'Huntington Dr', 'Mission Rd', 'Whittier Blvd', 'Monterey Rd', 'Orange Grove Blvd',
  'Fair Oaks Ave', 'Lake Ave', 'Sierra Madre Blvd', 'Broadway', 'Peck Rd',
  'Foothill Blvd', 'Colorado Blvd', 'Garfield Ave', 'Baldwin Ave', 'Hill Dr'
]

const neighborhoods = [
  'Eagle Rock', 'Highland Park', 'El Sereno', 'Lincoln Heights', 'Boyle Heights',
  'Glassell Park', 'Montecito Heights', 'Bungalow Heaven', 'North Monrovia',
  'Hastings Ranch', 'Canon Area', 'South Arroyo', 'Downtown Arcadia'
]

const notePool = [
  'Back gutter overflows during heavy rain.',
  'Oak leaves collect near garage line.',
  'Customer has dog in backyard.',
  'Use side gate entrance only.',
  'Steep rear section near patio cover.',
  'Pine needles from neighboring tree.',
  'Please avoid early morning before 9am.',
  'Interested in ongoing maintenance.',
  'Previous company missed rear downspout.',
  'Copper-style gutters on front elevation.',
  'No special access issues.',
  'Tenant will be onsite for access.',
  'Customer prefers text confirmation.',
  'Front section drips near walkway.',
  'Possible clog near left downspout.',
]

function rand<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function maybe(probability = 0.5): boolean {
  return Math.random() < probability
}

function sampleMany<T>(items: T[], maxCount: number): T[] {
  const count = randInt(0, maxCount)
  const pool = [...items]
  const picked: T[] = []

  for (let i = 0; i < count && pool.length; i++) {
    const index = randInt(0, pool.length - 1)
    picked.push(pool.splice(index, 1)[0])
  }

  return picked
}

function fakePhone() {
  const a = randInt(200, 989)
  const b = randInt(200, 999)
  const c = randInt(1000, 9999)
  return `(${a}) ${b}-${c}`
}

function fakeEmail(first: string, last: string) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'email.com']
  return `${first}.${last}${randInt(1, 99)}@${rand(domains)}`.toLowerCase()
}

function futureDate(daysOutMin = 1, daysOutMax = 45) {
  const d = new Date()
  d.setDate(d.getDate() + randInt(daysOutMin, daysOutMax))
  return d.toISOString().slice(0, 10)
}

function pastCreatedAt(maxDaysAgo = 30) {
  const d = new Date()
  d.setDate(d.getDate() - randInt(0, maxDaysAgo))
  d.setHours(randInt(8, 18), randInt(0, 59), randInt(0, 59), 0)
  return d.toISOString()
}

function inferPrice({
  serviceType,
  gutterFt,
  addOns,
  guardRemoval,
}: {
  serviceType: ServiceType
  gutterFt: number
  addOns: string[]
  guardRemoval: boolean
}) {
  let base = 160

  if (serviceType === 'Single-Story Home') base = 180
  if (serviceType === 'Two-Story Home') base = 260
  if (serviceType === 'Townhome / Duplex') base = 220
  if (serviceType === 'Small Commercial') base = 380

  if (gutterFt > 180) base += 35
  if (gutterFt > 240) base += 45
  if (gutterFt > 320) base += 60

  for (const addOn of addOns) {
    if (addOn === 'Heavy tree cover') base += randInt(50, 100)
    if (addOn === 'Difficult access') base += 50
    if (addOn === 'Gutter guards') base += 50
    if (addOn === 'Oversized gutters') base += randInt(25, 50)
  }

  if (guardRemoval) base += 60

  return base
}

function calculateQuote({
  serviceType,
  approxFt,
  addOns,
  gutterGuardRemoval,
}: {
  serviceType: ServiceType
  approxFt: number
  addOns: AddOnKey[]
  gutterGuardRemoval: boolean
}) {
  const baseByService: Record<ServiceType, number> = {
    single_story: 200,
    two_story: 300,
    multi_story: 475,
  }

  const addOnPrices: Record<AddOnKey, number> = {
    heavy_debris: 75,
    difficult_access: 50,
    gutter_guards: 50,
    oversized_gutters: 35,
  }

  let total = baseByService[serviceType]

  if (approxFt >= 300) {
    total = Math.max(total, 400)
  }

  for (const addOn of addOns) {
    total += addOnPrices[addOn] ?? 0
  }

  if (gutterGuardRemoval) {
    total += 25
  }

  return total
}

function buildMockBooking() {
  const first = rand(firstNames)
  const last = rand(lastNames)
  const area = rand(cities)
  const zip = rand(area.zip)
  const streetNumber = randInt(300, 5200)
  const street = rand(streets)

  const serviceType = rand<ServiceType>([
    'single_story',
    'single_story',
    'single_story',
    'two_story',
    'two_story',
    'multi_story',
  ])

  const approxFt =
    serviceType === 'single_story'
      ? randInt(90, 190)
      : serviceType === 'two_story'
        ? randInt(160, 290)
        : randInt(280, 460)

  const addOns = sampleMany(
    ['heavy_debris', 'difficult_access', 'gutter_guards', 'oversized_gutters'],
    2
  )

  const waterAccess = maybe(0.82)
  const gutterGuardRemoval = maybe(0.18)

  const maintenancePlan = rand([
    null,
    null,
    null,
    'seasonal',
    'quarterly',
  ])

  const totalQuote = calculateQuote({
    serviceType,
    approxFt,
    addOns,
    gutterGuardRemoval,
  })

  const discountedTotalQuote =
    maintenancePlan === 'seasonal'
      ? Math.round(totalQuote * 0.9)
      : maintenancePlan === 'quarterly'
        ? Math.round(totalQuote * 0.85)
        : null

  return {
    name: `${first} ${last}`,
    phone: fakePhone(),
    email: fakeEmail(first, last),
    city: area.city,
    zip,
    county: area.county ?? 'Los Angeles County',
    preferred_date: futureDate(),
    service_type: serviceType,
    approx_ft: approxFt,
    add_ons: addOns,
    water_access: waterAccess,
    gutter_guard_removal: gutterGuardRemoval,
    notes: rand(notePool),
    total_quote: totalQuote,
    discounted_total_quote: discountedTotalQuote,
    maintenance_plan: maintenancePlan,
    referral_count: randInt(0, 2),
    status: 'lead',
  }
}

async function main() {
  const count = Number(process.argv[2] || 500)

  if (count < 1 || count > 5000) {
    throw new Error('Provide a count between 1 and 5000')
  }

  const rows = Array.from({ length: count }, () => buildMockBooking())

  const chunkSize = 200

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)

    const { error } = await supabase.from('bookings').insert(chunk)

    if (error) {
      console.error('Insert failed on chunk', i / chunkSize + 1, error)
      process.exit(1)
    }

    console.log(`Inserted ${Math.min(i + chunk.length, rows.length)} / ${rows.length}`)
  }

  console.log(`Done. Inserted ${rows.length} mock bookings.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
