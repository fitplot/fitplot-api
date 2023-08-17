import { expect, test } from 'vitest';

import { generateId } from './id';

test('generates a 12 character nanoid', async () => {
  expect(await generateId()).toHaveLength(12);
});

test('generates unique ids', async () => {
  const one = await generateId();
  const two = await generateId();
  const three = await generateId();

  expect(one).not.toEqual(two);
  expect(one).not.toEqual(three);
  expect(two).not.toEqual(three);
});
