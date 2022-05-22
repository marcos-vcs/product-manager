package br.com.product.mannager.models.enums;

public enum Messages {
    HISTORY_CREATED_SUCCESSFULLY("REGISTRO CRIADO COM SUCESSO POR @USER"),
    HISTORY_UPDATED_SUCCESSFULLY("REGISTRO ALTERADO COM SUCESSO POR @USER"),
    HISTORY_DELETED_SUCCESSFULLY("REGISTRO EXCLUÍDO COM SUCESSO POR @USER"),
    HISTORY_RESTORE_SUCCESSFULLY("REGISTRO RESTAURADO COM SUCESSO POR @USER");

    private final String msg;
    Messages(String msg){
        this.msg = msg;
    }

    public String getMsg(){
        return msg;
    }
}
