export const permissions = [
    {
        role:'user',
        actions : [
            'get_profile',
            'update_profile',
            'delete_profile',
            'post_symptoms',
            'get_symptoms',
            'get_symptoms_id',
            'delete_symptoms',
            'delete_symptoms_id',
            'post_triggers',
            'get_triggers',
            'get_triggers_id',
            'delete_triggers',
            'delete_triggers_id',
            'post_medication',
            'get_medication',
            'get_medication_id',
            'delete_medication',
            'delete_medication_id',
            
        ]
    },
    {
        role: 'parent',
        actions:[
            'get_profile',
            'update_profile',
            'delete_profile',
            'post_symptoms',
            'get_symptoms_id',
            'post_triggers',
            'get_triggers_id',
            'post_medicatino',
            'get_medication_id'
            
        ]
    },
    {
        role: 'doctor',
        actions:[
            'get_profile',
            'get_symptoms_id',
            'get_triggers_id',
            'get_medication_id'
            
        ]
    }
]