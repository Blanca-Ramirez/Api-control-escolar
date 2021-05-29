const mongoose = require("mongoose");

const schema = new mongoose.Schema({
        firstname: {
            type: String,
            uppercase: true,
            required: true,
            maxlength: 50
        },

        lastname: {
            type: String,
            uppercase: true,
            required: true,
            maxlength: 50
        },

        curp: {
            type: String,
            required: true, 
            uppercase: true,
            validate: {
                validator: function (v) {
                  return /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(
                    v
                  );
                },
                message: (props) => `${props.value} No es una curp valida`
            }
        },

        create_date: {
            type: Date,
            default: Date.now,
            required: true
        },
        
        controlnumber: {
            type: String,
            required: true,
            unique: true
        },

        grade: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        career: {
            type: String,
            required: true,
            enum: ["ISC", "IGE", "IM", "IC" ]
        }
});

const studentModel = mongoose.model('Student',schema, 'student');
module.exports = studentModel;