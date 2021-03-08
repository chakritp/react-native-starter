import Chance from 'chance'
import FactoryGirl from 'lib/factoryGirlSync'

// Override the Chance generator to use a seeded instance
// for deterministic values.
export const chance = new Chance(1)

class CustomFactoryGirl extends FactoryGirl {
  constructor(options = {}) {
    super(options)
  }

  seqId(id: any) {
    return this.seq(id, (n: any) => `${n}`)
  }

  buildPaginated(name: string, { page = 1, limit = 20 } = {}, total = 100, attrs?: any, buildOptions?: {}) {
    const count = Math.min(total - (page - 1) * limit, limit)
    const data = count > 0 ? factory.buildMany(name, count, attrs, buildOptions) : []
    return {
      data: data,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit,
        total,
      }
    }
  }
}

export const factory = new CustomFactoryGirl()
