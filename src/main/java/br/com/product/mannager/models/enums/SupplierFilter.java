package br.com.product.mannager.models.enums;

public enum SupplierFilter {

    NAME("name"), PHONE("phone"), EMAIL("email");

    private String msg;
    SupplierFilter(String msg){
        this.msg = msg;
    }

    public String getFilter(){
        return msg;
    }

}
