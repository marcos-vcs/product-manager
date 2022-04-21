package br.com.product.mannager.models;

public enum Filter {

    NAME("name"), BRAND("brand"), PRICE("price");

    private String msg;
    Filter(String msg){
        this.msg = msg;
    }

    public String getFilter(){
        return msg;
    }

}
