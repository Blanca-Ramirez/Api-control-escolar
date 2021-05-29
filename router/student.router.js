const router = require('express').Router();

const mongoose = require('mongoose');
var status = require('http-status');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Student = require('../models/student.model');

module.exports = () => {
    /** Insertar estudiantes */
    router.post('/', (req, res) => {
        student = req.body;
        Student.create(student)
            .then(
                (data) => {
                    res.json({
                        code: status.OK,
                        msg: 'Se inserto correctamente',
                        data: data
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Ocurrio un error',
                                err: err.name,
                                detal: err.message
                            }
                        )
                }
            )
    });

    /** Eliminacion de estudiante por numero de control */
    router.delete('/:controlnumber', (req, res) => {
        controlnumber = req.params.controlnumber;
        Student.findOneAndDelete({ controlnumber: controlnumber })
            .then(
                (data) => {
                    if (data)
                        res.json({
                            code: status.OK,
                            msg: 'Se elimino correctamente',
                            data: data
                        })
                    else
                        res.status(status.NOT_FOUND)
                            .json({
                                code: status.NOT_FOUND,
                                msg: 'No se encontro elemento'
                            })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })

    /**Consulta general de estudiantes */
    router.get('/', (req, res) => {
        Student.find({})
            .then(
                (students) => {
                    res.json({
                        code: status.OK,
                        msg: 'Consulta correcta',
                        data: students
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })

    /**Consulta de un estudiante por numero de control */
    router.get('/:controlnumber', (req, res) => {
        const controlnumber = req.params.controlnumber;
        Student.findOne({ controlnumber: controlnumber })
            .then(
                (student) => {
                    if (student)
                        res.json({
                            code: status.OK,
                            msg: 'Consulta correcta',
                            data: student
                        });
                    else
                        res.status(status.NOT_FOUND)
                    res.json({
                        code: status.NOT_FOUND,
                        msg: 'No se encontro el elemento'
                    });
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })

    /**Actualizacion */
    router.put('/:controlnumber', (req, res) => {
        controlnumber = req.params.controlnumber;
        student = req.body;
        Student.findOneAndUpdate({ controlnumber: controlnumber }, student, { new: true })
            .then(
                (data) => {
                    console.log(data);
                    res.json({
                        code: status.OK,
                        msg: 'Se actualizo correctamente',
                        data: data
                    });
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST);
                    res.json({
                        code: status.BAD_REQUEST,
                        msg: 'Error en la aplicacion',
                        err: err.name,
                        detail: err.message
                    })
                }
            )
    })

    /** Estadística de estudiantes hombres y mujeres por carrera */
    router.post("/Hombre_Y_Mujer/", (req, res) => {
        Student.find({})
            .then((data) => {
                iscH = 0;
                imH = 0;
                igeH = 0;
                icH = 0;
                iscM = 0;
                imM = 0;
                igeM = 0;
                icM = 0;

                data.forEach((student, i) => {
                    if (data[i].career === "ISC") {
                        [...data[i].curp][10] === 'H' ? iscH++ : iscM++;
                    }
                    if (data[i].career === "IM") {
                        [...data[i].curp][10] === 'H' ? imH++ : imM++;
                    }
                    if (data[i].career === "IGE") {
                        [...data[i].curp][10] === 'H' ? igeH++ : igeM++;
                    }
                    if (data[i].career === "IC") {
                        [...data[i].curp][10] === 'H' ? icH++ : icM++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: [
                        ["ISC", ["HOMBRES: " + iscH, "MUJERES: " + iscM]],
                        ["IM", ["HOMBRES: " + imH, "MUJERES:" + imM]],
                        ["IGE", ["HOMBRES: " + igeH, "MUJERES: " + igeM]],
                        ["IC", ["HOMBRES: " + icH, "MUJERES:" + icM]],
                    ],
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    /** Estadística de estudiantes foráneos por carrera 11 - 12 */
    router.post("/Foraneos/", (req, res) => {
        Student.find({})
            .then((data) => {
                iscF = 0;
                imF = 0;
                igeF = 0;
                icF = 0;

                data.forEach((student, i) => {
                    if (data[i].career === "ISC") {
                        [...data[i].curp][11] !== 'N' && [...data[i].curp][12] !== 'T' ? iscF++ : null;
                    }
                    if (data[i].career === "IM") {
                        [...data[i].curp][11] !== 'N' && [...data[i].curp][12] !== 'T' ? imF++ : null;
                    }
                    if (data[i].career === "IGE") {
                        [...data[i].curp][11] !== 'N' && [...data[i].curp][12] !== 'T' ? igeF++ : null;
                    }
                    if (data[i].career === "IC") {
                        [...data[i].curp][11] !== 'N' && [...data[i].curp][12] !== 'T' ? icF++ : null;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: [
                        ["ISC", ["FORANEOS: " + iscF]],
                        ["IM", ["FORANEOS: " + imF]],
                        ["IGE", ["FORANEOS: " + igeF]],
                        ["IC", ["FORANEOS: " + icF]],
                    ],
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    /** Estadistica de estudiantes aprobados y no aprobados por carrera */
    router.post("/Aprobados_SI_NO/", (req, res) => {
        Student.find({})
            .then((data) => {
                iscA = 0;
                imA = 0;
                igeA = 0;
                icA = 0;
                iscR = 0;
                imR = 0;
                igeR = 0;
                icR = 0;

                data.forEach((student, i) => {
                    if (data[i].career === "ISC") {
                        data[i].grade >= 70 ? iscA++ : iscR++;
                    }
                    if (data[i].career === "IM") {
                        data[i].grade >= 70 ? imA++ : imR++;
                    }
                    if (data[i].career === "IGE") {
                        data[i].grade >= 70 ? igeA++ : igeR++;
                    }
                    if (data[i].career === "IC") {
                        data[i].grade >= 70 ? icA++ : icR++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: [
                        ["ISC", ["Aprobados: " + iscA, "Reprobados: " + iscR]],
                        ["IM", ["Aprobados: " + imA, "Reprobados: " + imR]],
                        ["IGE", ["Aprobados: " + igeA, "Reprobados: " + igeR]],
                        ["IC", ["Aprobados: " + icA, "Reprobados: " + icR]],
                    ],
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    /** Estadística de estudiantes mayores y menores de edad por carrera */
    router.post("/Menores_Y_Mayores/", (req, res) => {
        Student.find({})
            .then((data) => {
                iscM = 0;
                imM = 0;
                igeM = 0;
                icM = 0;
                iscN = 0;
                imN = 0;
                igeN = 0;
                icN = 0;

                data.forEach((student, i) => {
                    if (data[i].career === "ISC") {
                        [...data[i].curp][4] === '0' && parseInt([...data[i].curp][5]) > 3 ? iscN++ : iscM++;
                    }
                    if (data[i].career === "IM") {
                        [...data[i].curp][4] === '0' && parseInt([...data[i].curp][5]) > 3 ? imN++ : imM++;
                    }
                    if (data[i].career === "IGE") {
                        [...data[i].curp][4] === '0' && parseInt([...data[i].curp][5]) > 3 ? igeN++ : igeM++;
                    }
                    if (data[i].career === "IC") {
                        [...data[i].curp][4] === '0' && parseInt([...data[i].curp][5]) > 3 ? icN++ : icM++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: [
                        ["ISC", ["Mayores: " + iscM, "Menores: " + iscN]],
                        ["IM", ["Mayores: " + imM, "Menores: " + imN]],
                        ["IGE", ["Mayores:" + igeM, "Menores: " + igeN]],
                        ["IC", ["Mayores: " + icM, "Menores: " + icN]],
                    ],
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    return router;
}
