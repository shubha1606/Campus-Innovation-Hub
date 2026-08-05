import { useEffect, useState } from 'react'
import { MessageSquare, Users, FileText } from 'lucide-react'
import {
  getUsers,
  getProjects,
  createTeamRequest,
  getTeamRequests,
  updateTeamRequest
} from '../../services/api'

import { useAuth } from '../../context/AuthContext'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'


export default function StudentTeamRequests() {

  const { user } = useAuth()

  const [students,setStudents] = useState([])
  const [projects,setProjects] = useState([])
  const [requests,setRequests] = useState([])

  const [loading,setLoading] = useState(true)

  const [search,setSearch] = useState('')
  const [page,setPage] = useState(1)

  const [modalOpen,setModalOpen] = useState(false)

  const [selectedStudent,setSelectedStudent] = useState(null)
  const [selectedProject,setSelectedProject] = useState('')
  const [message,setMessage] = useState('')

  const debouncedSearch = useDebounce(search)

  const PER_PAGE = 12



  const loadRequests = async()=>{

    try{

      const {data}= await getTeamRequests()

      setRequests(data || [])

    }catch(error){

      toast.error("Unable to load requests")

    }

  }



  useEffect(()=>{

    let mounted=true


    const loadData=async()=>{

      try{

        const usersRes=await getUsers()

        if(mounted){

          setStudents(
            usersRes.data.filter(
              u=>u.role==="student" &&
              u._id!==user?._id
            )
          )

        }


        const projectsRes=await getProjects()

        if(mounted){

          setProjects(projectsRes.data || [])

          setSelectedProject(
            projectsRes.data?.[0]?._id || ''
          )

        }


        await loadRequests()


      }catch(error){

        toast.error("Unable to load data")

      }


      setLoading(false)

    }


    loadData()


    return()=>{

      mounted=false

    }


  },[user])





  const studentsWithMatch = students.map(student=>({

    ...student,

    matchCount:
    (student.skills || [])
    .filter(skill =>
      user?.skills?.includes(skill)
    ).length

  }))





  const filtered = studentsWithMatch
  .filter(student=>

    student.name?.toLowerCase()
    .includes(debouncedSearch.toLowerCase())

    ||

    student.college?.toLowerCase()
    .includes(debouncedSearch.toLowerCase())

    ||

    student.branch?.toLowerCase()
    .includes(debouncedSearch.toLowerCase())

  )




  const paginated =
  filtered.slice(
    (page-1)*PER_PAGE,
    page*PER_PAGE
  )




  const openRequestModal=(student)=>{

    setSelectedStudent(student)

    setMessage('')

    setModalOpen(true)

  }




  const handleSendRequest=async(e)=>{

    e.preventDefault()


    if(!message.trim()){

      return toast.error(
        "Add message"
      )

    }



    try{


      await createTeamRequest({

        receiver:selectedStudent._id,

        project:selectedProject,

        message

      })


      toast.success(
        "Team request sent"
      )


      setModalOpen(false)

      loadRequests()



    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed"
      )

    }


  }





  const handleStatusUpdate=async(id,status)=>{


    try{


      await updateTeamRequest(
        id,
        {status}
      )


      toast.success(
        `Request ${status}`
      )


      loadRequests()



    }catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to update"
      )

    }

  }






return (

<div className="space-y-5 fade-in">


<div className="page-header">

<h1 className="text-xl font-bold gold-gradient-text">
Find Teammates
</h1>


<p className="text-sm">
{filtered.length} students available
</p>


</div>




<div className="grid gap-4 lg:grid-cols-[1fr_320px]">



<div>


<SearchBar
value={search}
onChange={setSearch}
placeholder="Search students"
/>



{
loading ?

<div>
Loading...
</div>


:

<div className="grid sm:grid-cols-2 gap-4 mt-4">


{

paginated.map(student=>(


<div
key={student._id}
className="card p-4"
>


<div className="flex gap-3">


<Avatar
name={student.name}
src={student.profileImage}
/>


<div>

<p className="font-semibold">
{student.name}
</p>

<p className="text-xs">
{student.branch}
</p>


</div>


</div>



<button
className="btn-primary mt-3"
onClick={()=>openRequestModal(student)}
>

<MessageSquare size={14}/>

Request Team

</button>


</div>


))

}


</div>


}



</div>





<div className="space-y-4">



{/* SENT REQUESTS */}

<div className="card p-5">

<div className="flex gap-2">

<FileText size={18}/>

<h3 className="font-semibold">
Your Sent Requests
</h3>

</div>



{

requests
.filter(
r=>r.sender?._id===user?._id
)
.map(req=>(


<div
key={req._id}
className="border rounded-xl p-3 mt-3"
>


<p>
To: {req.receiver?.name}
</p>


<p className="text-xs">
Status: {req.status}
</p>


<p className="text-xs">
{req.message}
</p>


</div>


))

}


</div>







{/* RECEIVED REQUESTS */}


<div className="card p-5">


<div className="flex gap-2">

<Users size={18}/>

<h3 className="font-semibold">
Incoming Requests
</h3>


</div>



{

requests
.filter(
r=>r.receiver?._id===user?._id
)
.map(req=>(


<div
key={req._id}
className="border rounded-xl p-3 mt-3"
>


<p>
From: {req.sender?.name}
</p>


<p className="text-xs">
{req.message}
</p>



<p className="text-xs">
Status: {req.status}
</p>




{
req.status==="Pending" &&

<div className="flex gap-2 mt-3">


<button
className="btn-primary"
onClick={()=>
handleStatusUpdate(
req._id,
"Accepted"
)
}
>
Accept
</button>



<button
className="btn-secondary"
onClick={()=>
handleStatusUpdate(
req._id,
"Rejected"
)
}
>
Reject
</button>



</div>

}



</div>


))


}



</div>


</div>



</div>





<Modal
open={modalOpen}
onClose={()=>setModalOpen(false)}
title={`Request Team - ${selectedStudent?.name}`}
>


<form
onSubmit={handleSendRequest}
className="space-y-4"
>



<textarea
className="input"
rows="5"
value={message}
onChange={
e=>setMessage(e.target.value)
}
placeholder="Message"
/>



<button className="btn-primary">

Send Request

</button>



</form>



</Modal>



</div>

)

}