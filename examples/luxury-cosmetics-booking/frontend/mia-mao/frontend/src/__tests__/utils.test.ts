import hashCode from '../utils/colors';

describe('test utils', () => {
  it('test greenish', () => {
    const code = hashCode('greenish');
    expect(code).toEqual('#66fa95');
  });
});
