export class CommonLocalStorage{
    static GetIsEmployee() {
        const isEmployeeKey = "isEmployee";
        const isEmployee = localStorage.getItem(isEmployeeKey);
        return isEmployee;
    }

    static SetIsEmployee(status) {
        const isEmployeeKey = "isEmployee";
        localStorage.setItem(isEmployeeKey, status);
    }

    static Clear(){
        localStorage.clear();
        Swal.fire("Cache is clear!", "", "success")
    }
}