import { createSearchParams, useNavigate } from "react-router-dom"
import Pagination from "../Pagination/Pagination";

const TableDisplay = ({ data, paginationData, loadPage, updateSelectedPageSize }) => {
    const navigate = useNavigate()

    const showCustomerDetails = (id) => {
        navigate({
            pathname: "/biteandsip/admin/customers/view",
            search: createSearchParams({
                customer_id: `${id}`
            }).toString()
        });
    }

    return <div className="table-outer-container">
        <table>
    <thead>
        <tr>
            <th>EMAIL</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>ACTIVE</th>
            <th style={{textAlign: "end"}}></th>
        </tr>
    </thead>
    <tbody>
        {
            data.map((element) => {
                return <tr key={element.id}>
                    <td>{element.username}</td>
                    <td>{element.firstName}</td>
                    <td>{element.lastName}</td>
                    <td>{element.enabled ? <span style={{backgroundColor: "green", color: "white", padding: "3px 6px", borderRadius: "5px"}}>ACTIVE</span> : <span style={{backgroundColor: "red", color: "white", padding: "3px 6px", borderRadius: "5px"}}>INACTIVE</span>}</td>
                    <td style={{textAlign: "end"}}><span className="material-symbols-rounded" 
                    style={{border: "2px solid black", borderRadius: "5px", padding: "5px", cursor: "pointer"}}
                    onClick={() => showCustomerDetails(element.id)}>more_horiz</span></td>
                </tr>
            })
        }
    </tbody>
</table>
<Pagination paginationData={paginationData} loadPage={loadPage} updateSelectedPageSize={updateSelectedPageSize} />
</div>
}

export default TableDisplay