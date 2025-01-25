

const ModifierModal = ({ modifierListData, handleCheckboxChange, setIsModalOpen, selectedOption }: any) => {
    return <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[99999] pb-[80px] px-[20px] "
        onClick={() => setIsModalOpen(false)}
    >
        <div
             className="bg-white rounded-lg w-full p-[30px] relative"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-full flex flex-col items-start justify-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-[10px]">Customization</h2>
                {modifierListData && modifierListData?.length && modifierListData.map((modifier: any) => (
                    <div
                        key={modifier?.id}
                        className="flex items-center justify-between w-full py-[10px] relative"
                    >
                        <span className='absolute w-full border-b border-dotted border-[#222A4A] z-[1]'  />
                        <span  className=" bg-white min-w-[100px] relative z-[2]">{modifier?.modifier_data?.name}</span>
                        <div className="bg-white relative z-[2] flex pl-[10px]">

                            <input
                                type="checkbox"
                                id={modifier?.modifier_data?.name}
                                name="customization"
                                value={modifier?.modifier_data?.name}
                                checked={selectedOption.includes(modifier?.modifier_data?.name)}
                                onChange={() => handleCheckboxChange(modifier?.modifier_data?.name, modifier?.id)}
                                 className="hidden peer"
                            />

                            <label
                                htmlFor={modifier?.modifier_data?.name}
                              className="w-5 h-5 border border-[#222A4A] rounded-full flex items-center justify-center cursor-pointer peer-checked:border-[#A02621] peer-checked:bg-[#A02621]"
                            >
                                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:bg-[#A02621]"></div>
                            </label>
                        </div>

                        {/* <span className=' bg-white relative z-[2] flex pl-[10px]'>
                    
                    </span> */}

                    </div>
                ))}


            </div>
        </div>
    </div>
}

export default ModifierModal;