
export const RecapDate = ({start, end, roundtrip }) => {
    // Test
    
    const formattter = new Intl.DateTimeFormat("vi-VN", {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
    return (
        <>
            {roundtrip ? (
                <div className="flex w-1/2 h-full justify-between items-center
                                border-r-2 border-white gap-8">
                    <div className="w-fit h-full flex flex-col justify-between items-start pl-2">
                        <p className="text-white inter-black">Khởi hành</p>
                        <p className="text-white inter-black">{formattter.format(start)}</p>                    
                    </div>
                    <div className="w-fit h-full flex flex-col justify-between items-start pr-2">
                        <p className="text-white inter-black">Trở về</p>
                        <p className="text-white inter-black">{formattter.format(end)}</p>                    
                    </div>
                </div>
                
            ) : (
                <div className="w-3/10 h-full px-6 flex flex-col justify-between
                                border-r-2 border-white">
                    <p className="text-white inter-black">Khởi hành</p>
                    <p className="text-white inter-black">{formattter.format(start)}</p>

          
                </div>
            )}
        </>
    );
}