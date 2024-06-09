'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Timer from "../Timer/Timer";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';;
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PrivateRoute from "../Private/PrivateRoute";
import Rating from '@mui/material/Rating';
import toast, { Toaster } from 'react-hot-toast';

const Module = ({ module }) => {
    const router = useRouter();

    const defVideo = module.videos[0].vlink; // Default video link

    // Storing current video id in state
    const [currentVideo, setCurrentVideo] = useState(module.videos[0].vlink);

    // Storing current video id in state
    const [currentVideoIndex, setVideoIndex] = useState(0);

    // Storing time duration for workout timer
    const [timerDuration, setTimerDuration] = useState(600);

    // Storing rating value in state
    const [newRatingValue, setRatingValue] = useState(2);

    const { data: session } = useSession();// Getting session data using useSession hook

    // Function to handle module change
    const handleModule = async (vid, vidIndex) => {
        setCurrentVideo('')
        setCurrentVideo(vid.vlink)
        setVideoIndex(vidIndex)
    }

    // Function to handle next video
    const handleNext = () => {
        if (module.videos.length === currentVideoIndex) {
            setCurrentVideo(module.videos[0].vlink) // Set first video if it's the last video
            router.push('/modules') // Redirect to modules page
            return;
        }
        setVideoIndex(currentVideoIndex + 1); // Increment video index
        setCurrentVideo(module.videos[currentVideoIndex].vlink); // Set next video

        const watchDetails = {
            userEmail: session.user.email,
            vidId: module.videos[currentVideoIndex]?._id
        }
        axios.patch('https://fit-track-server.vercel.app/api/v1/updatewatchhistory', watchDetails)

    }
    // State variables for unlocked videos and trigger update
    const [unlockedVideos, setUnlockedVideos] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    // Effect to fetch user watch history and update unlocked videos
    useEffect(() => {
        if (session && session.user.email) {
            axios.get(`https://fit-track-server.vercel.app/api/v1/singleuser?email=${session.user.email}`)
                .then(res => {
                    // Extract the video IDs from the watch history
                    const watchedVideoIds = res.data.watchHistory.map(item => item.videoId);

                    // Determine which videos are unlocked based on watch history
                    const unlockVideos = module.videos.reduce((acc, vid, index) => {
                        if (watchedVideoIds.includes(vid._id)) {
                            acc.push(index); // Video is unlocked if its ID exists in watch history
                        }
                        return acc;
                    }, []);
                    setUnlockedVideos(unlockVideos);
                    setTriggerUpdate(prevState => !prevState); // Trigger re-render
                })
                .catch(error => {
                    console.error('Error fetching user watch history:', error);
                });
        }
        // Fetch user watch history from the backend
    }, [unlockedVideos, module.videos, session]);

    useEffect(() => {
        // This effect is triggered whenever the triggerUpdate state changes
    }, [triggerUpdate]);

    // Function to handle previous video
    const handlePrev = () => {
        if (currentVideoIndex === 0) {
            setCurrentVideo(module.videos[0].vlink); // Set first video if it's the current video
            return
        }
        setVideoIndex(currentVideoIndex - 1); // Decrement video index
        setCurrentVideo(module.videos[currentVideoIndex].vlink); // Set previous video

    }


    const handleTimer = (e) => {
        e.preventDefault();
        const form = e.target;
        const timeValue = parseInt(form.num.value, 10); // Parse the input value as an integer
        if (!isNaN(timeValue)) { // Check if the parsed value is a valid number
            setTimerDuration(timeValue);
        }
    }

    const time = new Date();
    time.setSeconds(time.getSeconds() + timerDuration); // Calculate timer expiry timestamp
    const [value, setValue] = useState('1'); // State variable for tab value

    // Function to handle tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Function to handle feedback submission
    const handleFeedBackFrom = (e) => {
        e.preventDefault();
        const form = e.target;
        const feedback = form.feedback.value;
        

        const feedBackData = {
            serviceId: module._id ,
            email: session.user.email,
            userImage: session.user.image,
            comment: feedback,
            rating: newRatingValue
        }
       axios.post('https://fit-track-server.vercel.app/api/v1/postuserreview',feedBackData)
       .then((res)=>{
        if(res.data == 'Review Posted!'){
            toast('Thank your for your review!')
        }
       })
       
     
    }
    return (
        <PrivateRoute> {/* Render only if user is authenticated */}
            <div className=" flex flex-col lg:flex-row gap-4 my-4 mx-8">
                <div className="w-full">
                    <iframe className="rounded-md" width="100%" height="400" src={currentVideo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    <div className="flex justify-between gap-4">
                        <button onClick={handlePrev} className="bg-[#252525] px-8 py-3 my-6 text-white w-full md:w-1/5 rounded-[30px] hover:bg-[#378ae5] transition-all">👈 Previous</button>
                        <button onClick={handleNext} className="bg-[#252525] px-8 py-3 my-6 text-white w-full md:w-1/5 rounded-[30px] hover:bg-[#378ae5] transition-all">Next 👉</button>
                    </div>
                    <div> {/* Tab navigation */}
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Overview" value="1" />
                                        <Tab label="Timer" value="2" />
                                        <Tab label="Feedback" value="3" />
                                        <Tab label="Review" value="4" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1"><p className=" leading-6">{module.overview}</p></TabPanel>
                                <TabPanel value="2">
                                    <div className="block mx-auto text-center border-black border-[1px] py-5 rounded-md bg-black">
                                        <Timer expiryTimestamp={time} className='text-white' />
                                    </div>
                                </TabPanel>
                                <TabPanel value="3">
                                    <div className="text-center my-8 flex flex-col">
                                        <h1 className="text-3xl w-full text-start mx-auto font-semibold">Please, share your feedback about this module. Your Feedback will help use to make better our service.</h1>
                                        <form onSubmit={handleFeedBackFrom}>
                                            <div className="text-start mt-4 mb-4">
                                                <Rating
                                                    name="simple-rating"
                                                    size="large"
                                                    value={newRatingValue}
                                                    onChange={(event, ratingValue) => {
                                                        setRatingValue(ratingValue);
                                                    }}
                                                />
                                            </div>
                                            <textarea className="mx-auto border-black border-[1px] w-full h-44 rounded-md p-4" name="feedback" placeholder="Write your feedback here..." />
                                            <button className="bg-[#252525] px-8 py-3 my-4 mx-auto text-white w-full md:w-1/5 rounded-[30px] hover:bg-[#378ae5] transition-all">Submit 👉</button>
                                        </form>
                                    </div>
                                </TabPanel>
                                <TabPanel value='4'>
                                    Users Review
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                </div>
                <div className="w-full lg:w-[40%] px-4 rounded-md h-fit">
                    <h1 className="text-3xl font-extrabold mb-4">{module.heading}</h1>
                    <ul>
                        {
                            module.videos.map((vid, vidIndex) => <li
                                key={vid._id}
                                className={`flex text-lg text-black border-gray border-[1px] mb-5 p-2 rounded-md cursor-pointer hover:bg-[#378ae5] hover:text-[#fff] transition-all ${unlockedVideos.includes(vidIndex) ? '' : 'opacity-50 pointer-events-none'}`}
                                onClick={() => { handleModule(vid, vidIndex) }}>
                                <span>
                                    <CheckRoundedIcon className={` text-[#378ae5] transition-all ${unlockedVideos.includes(vidIndex) ? '' : 'opacity-50 pointer-events-none'}`} />
                                </span>
                                {vidIndex + 1}. {vid.title}
                            </li>)
                        }
                    </ul>
                </div>
            </div>
            <Toaster/>
        </PrivateRoute>
    );
};

export default Module;