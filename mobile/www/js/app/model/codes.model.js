/**
 * CODES and STATUSES constants
 */
define(function(){
	return {
		CALLTYPES: {
			POLICE: 1,
			FIREFIGHTERS: 2,
			AMBULANCE: 3,
			VIOLENCE: 4
		},

		CALLTYPES_BY_CODE: {
			1: 'POLICE',
			2: 'FIREFIGHTERS',
			3: 'AMBULANCE',
			4: 'VIOLENCE'
		},

		MSG_STATUS_DESCRIPTION: {
			1: 'Alerta recibida',
			2: 'Alerta procesada por operador'
		}

	};
});