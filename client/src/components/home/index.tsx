import { motion } from 'motion/react';
// import { useTheme } from 'next-themes'

const HomePage = () => {
  // const {theme} = useTheme()
  return (
    <section>
      <div className="flex flex-col relative p-8 rounded-[30px] md:max-w-6xl mx-auto my-5 gap-10 md:gap[100px] pb-[50px] md:pb-0 md:flex-row items-center justify-center flex-grow bg-transparent selection:bg-emerald-950 selection:text-emerald-400 dark:overflow-hidden">
        <div className="flex flex-col text-white z-10 relative items-center justify-center w-full px-4 md:px-0">
          <div className="max-w-4xl text-center leading-none pt-10 md:pt-20">
            <div className="border inline-block font-ClashDisplayRegular px-4 py-2 backdrop-blur-xl border-primary/30 text-xs md:text-sm mb-8 rounded-full">
              <span>Create Once, Publish Everywhere🎉</span>
            </div>
            <h1 className="text-[36px] leading-none sm:text-[60px] lg:text-[80px]">
              Craft, Schedule, and <span className="text-orange-500">Publish</span> - All in One
              Hub, Just a Click Away!
            </h1>
          </div>

          <motion.div></motion.div>

          {/* {theme == "dark" ? (
              <div className='absoulte top-0 left-0 w-full h-full'>
                
              </div>
          ) : (

          )} */}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
