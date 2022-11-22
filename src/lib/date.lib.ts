export class DateLib {

  static formatDate(d: Date): string {
    console.log(`d: ${JSON.stringify(d)}`)
    const sd =
      ('0' + d.getUTCDate()).slice(-2) + '.' +
      ('0' + (d.getUTCMonth()+1)).slice(-2) + '.' +
      d.getUTCFullYear() + ', ' +
      ('0' + d.getUTCHours()).slice(-2) + ':' +
      ('0' + d.getUTCMinutes()).slice(-2) + ':' +
      ('0' + d.getUTCSeconds()).slice(-2)
    console.log(`sd: ${JSON.stringify(sd)}`)
    return sd
  }
}