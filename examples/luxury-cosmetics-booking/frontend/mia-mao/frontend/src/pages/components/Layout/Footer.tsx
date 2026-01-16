import { Button } from '@/components/ui/button';

const background =
  "data:image/svg+xml,%3Csvg width='196' height='81' viewBox='0 0 196 81' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M149.597 33.3491C174.254 46.4282 210.797 44.9218 220.817 70.9721C231.097 97.6982 210.664 125.791 194.155 149.188C178.595 171.241 158.039 188.471 132.264 196.474C103.832 205.303 72.0544 210.119 46.3617 195.079C19.9841 179.639 2.69546 150.045 0.82855 119.537C-0.850687 92.0966 20.996 71.1868 37.4315 49.1486C52.0504 29.546 64.9231 4.53473 89.1376 1.12393C112.646 -2.18747 128.624 22.2242 149.597 33.3491Z' fill='%231A3547'/%3E%3C/svg%3E%0A";

export default function Footer() {
  return (
    <footer
      className='w-full p-4 pb-5 bg-[#1A3547]'
      style={{
        backgroundImage: `url("${background}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
      }}
    >
      <div className='grid grid-cols-2 gap-4'>
        <div className='col-span-1'>
          <h3 className='text-2xl font-semibold text-white mb-2'>An issue?</h3>
          <p className='text-white'>
            If you encounter any difficulty or if something isn&apos;t working don&apos;t hesitate
            to send us a message!
          </p>
        </div>
        <div className='col-span-1 flex justify-end items-center'>
          <Button
            variant='secondary'
            className='w-[216px] bg-white hover:bg-gray-100 text-gray-900'
            data-layer-type='footer-message'
          >
            Report an issue
          </Button>
        </div>
      </div>
    </footer>
  );
}
