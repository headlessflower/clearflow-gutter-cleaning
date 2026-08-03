import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.ts'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type ServiceType = Database['public']['Enums']['service_type']
type AddOnKey = 'heavy_debris' | 'difficult_access' | 'gutter_guards' | 'oversized_gutters'
type MaintenancePlan = 'seasonal' | 'quarterly' | null
type BookingStatus = 'lead' | 'contacted' | 'scheduled' | 'completed'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const firstNames = [
  'Devon', 'Linda', 'Carlos', 'Emily', 'Robert', 'Marcus', 'Sandra', 'Daniel',
  'Sofia', 'Anthony', 'Javier', 'Melissa', 'George', 'Kevin', 'Isabel', 'Tyler',
  'Rachel', 'Victor', 'Olivia', 'Miguel', 'Paul', 'Kimberly', 'Chris', 'Natalie',
  'Ariana', 'Jose', 'Brenda', 'Leo', 'Monica', 'Diana', 'Trevor', 'Vanessa',
]

const lastNames = [
  'Martinez', 'Chen', 'Ramirez', 'Torres', 'Alvarez', 'Lee', 'Lopez', 'Kim',
  'Hernandez', 'Russo', 'Gutierrez', 'Wong', 'Salazar', 'Park', 'Rivera', 'Grant',
  'Stein', 'Maldonado', 'Bennett', 'Soto', 'Harrison', 'Tran', 'Delgado', 'Flores',
  'Morales', 'Castillo', 'Vega', 'Ortega', 'Cruz', 'Navarro',
]

const cities = [
  { city: 'Los Angeles', zips: ['90023', '90026', '90031', '90032', '90033', '90041', '90042', '90065'] },
  { city: 'Pasadena', zips: ['91103', '91104', '91105', '91106', '91107'] },
  { city: 'Glendale', zips: ['91201', '91203', '91205', '91206', '91208'] },
  { city: 'Burbank', zips: ['91501', '91502', '91504', '91505'] },
  { city: 'Long Beach', zips: ['90802', '90804', '90807', '90808'] },
  { city: 'Torrance', zips: ['90501', '90503', '90505'] },
  { city: 'Downey', zips: ['90240', '90241', '90242'] },
  { city: 'Arcadia', zips: ['91006', '91007'] },
  { city: 'Monrovia', zips: ['91016'] },
  { city: 'Sierra Madre', zips: ['91024'] },
  { city: 'South Pasadena', zips: ['91030'] },
  { city: 'La Cañada Flintridge', zips: ['91011'] },
  { city: 'Duarte', zips: ['91010'] },
  { city: 'El Monte', zips: ['91731', '91732'] },
  { city: 'San Gabriel', zips: ['91775', '91776'] },
  { city: 'Temple City', zips: ['91780'] },
  { city: 'Claremont', zips: ['91711'] },
  { city: 'San Marino', zips: ['91108'] },
]

const notePool = [
  'Back gutter overflows during heavy rain.',
  'Oak leaves collect near the garage line.',
  'Customer has a dog in the backyard.',
  'Use the side gate entrance only.',
  'Steep rear section near the patio cover.',
  'Pine needles collect from a neighboring tree.',
  'Please avoid appointments before 9am.',
  'Interested in ongoing maintenance.',
  'Previous company missed the rear downspout.',
  'Copper gutters on the front elevation.',
  'No special access issues.',
  'Tenant will be onsite for access.',
  'Customer prefers text confirmation.',
  'Possible clog near the left downspout.',
]

const emailDomains = ['gmail.com', 'hotmail.com', 'protonmail.com', 'yahoo.com', 'outlook.com']
const laAreaCodes = ['213', '310', '323', '424', '562', '626', '747', '818']
const addOnKeys: AddOnKey[] = [
  'heavy_debris',
  'difficult_access',
  'gutter_guards',
  'oversized_gutters',
]

const pricing = {
  baseByService: { single_story: 200, two_story: 300, multi_story: 475 },
  ftThreshold: 300,
  minOverFt: 400,
  addOns: { heavy_debris: 75, difficult_access: 50, gutter_guards: 50, oversized_gutters: 35 },
  gutterGuardRemoval: 25,
  seasonalDiscount: 0.1,
  quarterlyDiscount: 0.15,
  referralDiscount: 25,
} satisfies {
  baseByService: Record<ServiceType, number>
  addOns: Record<AddOnKey, number>
  [key: string]: unknown
}

function rand<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function maybe(probability = 0.5): boolean {
  return Math.random() < probability
}

function sampleMany<T>(items: readonly T[], maxCount: number): T[] {
  const pool = [...items]
  return Array.from({ length: randInt(0, maxCount) }, () => {
    const index = randInt(0, pool.length - 1)
    return pool.splice(index, 1)[0]
  })
}

function fakePhone(index: number): string {
  // NANP reserves 555-0100 through 555-0199 for fictional use.
  const areaCode = laAreaCodes[index % laAreaCodes.length]
  const lineNumber = 100 + (Math.floor(index / laAreaCodes.length) % 100)
  return `(${areaCode}) 555-${String(lineNumber).padStart(4, '0')}`
}

function fakeEmail(first: string, last: string, index: number): string {
  // The explicit clearflow.mock marker makes these easy to recognize and suppress.
  const localPart = `${first}.${last}.clearflow.mock.${String(index + 1).padStart(4, '0')}`
  return `${localPart}@${rand(emailDomains)}`.toLowerCase()
}

function dateAtOffset(days: number, hour = 12): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, randInt(0, 59), randInt(0, 59), 0)
  return date
}

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number, hour = date.getHours()): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  result.setHours(hour, randInt(0, 59), randInt(0, 59), 0)
  return result
}

function inferStatus(index: number): BookingStatus {
  const bucket = index % 20
  if (bucket === 17 || bucket === 18) return 'contacted'
  if (bucket === 19) return 'scheduled'
  if (bucket === 16) return 'completed'
  return 'lead'
}

function quoteFor(
  serviceType: ServiceType,
  approxFt: number,
  addOns: AddOnKey[],
  gutterGuardRemoval: boolean,
): number {
  let total = pricing.baseByService[serviceType]
  if (approxFt >= pricing.ftThreshold) total = Math.max(total, pricing.minOverFt)
  for (const addOn of addOns) total += pricing.addOns[addOn]
  if (gutterGuardRemoval) total += pricing.gutterGuardRemoval
  return total
}

function discountedQuote(
  total: number,
  maintenancePlan: MaintenancePlan,
  referralCount: number,
): number | null {
  const rate = maintenancePlan === 'seasonal'
    ? pricing.seasonalDiscount
    : maintenancePlan === 'quarterly'
      ? pricing.quarterlyDiscount
      : 0
  const discount = (rate ? Math.round(total * rate) : 0) + referralCount * pricing.referralDiscount
  return discount > 0 ? Math.max(total - discount, 0) : null
}

function buildMockBooking(index: number): BookingInsert {
  const first = rand(firstNames)
  const last = rand(lastNames)
  const area = rand(cities)
  const serviceType = rand<ServiceType>([
    'single_story', 'single_story', 'single_story', 'two_story', 'two_story', 'multi_story',
  ])
  const approxFt = serviceType === 'single_story'
    ? randInt(90, 220)
    : serviceType === 'two_story'
      ? randInt(160, 320)
      : randInt(250, 480)
  const addOns = sampleMany(addOnKeys, 3)
  const maintenancePlan = rand<MaintenancePlan>([null, null, null, 'seasonal', 'quarterly'])
  const referralCount = maybe(0.16) ? randInt(1, 2) : 0
  const gutterGuardRemoval = maybe(0.18)
  const totalQuote = quoteFor(serviceType, approxFt, addOns, gutterGuardRemoval)
  const status = inferStatus(index)
  const createdAt = status === 'completed'
    ? dateAtOffset(-randInt(20, 60), randInt(8, 18))
    : dateAtOffset(-randInt(0, 45), randInt(8, 18))
  const contactedAt = status === 'lead' ? null : addDays(createdAt, randInt(1, 3), randInt(8, 18))
  const scheduledFor = status === 'scheduled'
    ? dateAtOffset(randInt(1, 14), randInt(8, 16))
    : status === 'completed' && contactedAt
      ? addDays(contactedAt, randInt(1, 5), randInt(8, 16))
      : null
  const completedAt = status === 'completed' && scheduledFor
    ? addDays(scheduledFor, randInt(0, 2), randInt(10, 18))
    : null
  const preferredDate = scheduledFor ?? dateAtOffset(randInt(-3, 45))

  return {
    name: `${first} ${last}`,
    phone: fakePhone(index),
    email: fakeEmail(first, last, index),
    city: area.city,
    zip: rand(area.zips),
    county: 'Los Angeles County',
    preferred_date: dateOnly(preferredDate),
    service_type: serviceType,
    approx_ft: approxFt,
    add_ons: addOns,
    water_access: maybe(0.82),
    gutter_guard_removal: gutterGuardRemoval,
    notes: rand(notePool),
    total_quote: totalQuote,
    discounted_total_quote: discountedQuote(totalQuote, maintenancePlan, referralCount),
    maintenance_plan: maintenancePlan,
    referral_count: referralCount,
    status,
    admin_notes: status === 'lead' ? null : `Synthetic ${status} workflow fixture.`,
    contacted_at: contactedAt?.toISOString() ?? null,
    scheduled_for: scheduledFor?.toISOString() ?? null,
    completed_at: completedAt?.toISOString() ?? null,
    created_at: createdAt.toISOString(),
    updated_at: (completedAt ?? scheduledFor ?? contactedAt ?? createdAt).toISOString(),
  }
}

async function main() {
  const count = Number(process.argv[2] ?? 500)
  if (!Number.isInteger(count) || count < 300 || count > 5000) {
    throw new Error('Provide a whole-number customer count between 300 and 5000')
  }

  const rows = Array.from({ length: count }, (_, index) => buildMockBooking(index))
  const chunkSize = 200

  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize)
    const { error } = await supabase.from('bookings').insert(chunk)
    if (error) throw new Error(`Insert failed on chunk ${offset / chunkSize + 1}: ${error.message}`)
    console.log(`Inserted ${Math.min(offset + chunk.length, rows.length)} / ${rows.length}`)
  }

  const counts = rows.reduce<Record<BookingStatus, number>>(
    (result, row) => {
      result[row.status as BookingStatus] += 1
      return result
    },
    { lead: 0, contacted: 0, scheduled: 0, completed: 0 },
  )
  console.log(`Done. Inserted ${rows.length} mock customers.`, counts)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
