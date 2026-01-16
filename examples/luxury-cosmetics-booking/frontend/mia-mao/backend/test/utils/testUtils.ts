export function buildQueries(queriesObject: { [key: string]: string | string[] }) {
  const queries = Object.entries(queriesObject).map((object) => {
    if (typeof object[1] === 'object') {
      return object[1].reduce(
        (accum, value, index) =>
          accum + `${object[0]}[${index}]=${value}${index === object[1].length - 1 ? '' : '&'}`,
        ''
      );
    }
    return object[0] + '=' + object[1];
  });
  return `?${queries.join('&')}`;
}
