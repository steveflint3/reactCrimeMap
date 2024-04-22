declare namespace Schemas {
  interface Crime {
    data: Offenses[]
    keys: string[]
    title: string
  }

  type Offenses = Record<string, number>;

}
