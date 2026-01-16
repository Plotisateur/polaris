export default function Background() {
  return (
    <div
      className='fixed inset-0 w-full h-full -z-10 bg-linear-to-b from-secondary-dark to-primary-dark'
      aria-hidden='true'
    />
  );
}
