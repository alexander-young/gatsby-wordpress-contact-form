<?php
// Functions.php
add_action('graphql_register_types', function () {

	register_graphql_mutation('createSubmission', [
		'inputFields' => [
			'firstName' => [
				'type' => 'String',
				'description' => 'User First Name',
			],
			'lastName' => [
				'type' => 'String',
				'description' => 'User Last Name',
			],
			'favoriteFood' => [
				'type' => 'String',
				'description' => 'User Favorite Food',
			],
			'message' => [
				'type' => 'String',
				'description' => 'User Message',
			],
		],
		'outputFields' => [
			'success' => [
				'type' => 'Boolean',
				'description' => 'Whether or not data was stored successfully',
				'resolve' => function ($payload, $args, $context, $info) {
					return isset($payload['success']) ? $payload['success'] : null;
				}
			],
			'data' => [
				'type' => 'String',
				'description' => 'Payload of submitted fields',
				'resolve' => function ($payload, $args, $context, $info) {
					return isset($payload['data']) ? $payload['data'] : null;
				}
			]
		],
		'mutateAndGetPayload' => function ($input, $context, $info) {

			if (!class_exists('ACF')) return [
				'success' => false,
				'data' => 'ACF is not installed'
			];

			$sanitized_data = [];
			$errors = [];
			$acceptable_fields = [
				'firstName' => 'field_5db38290cbb0d',
				'lastName' => 'field_5db3829bcbb0e',
				'favoriteFood' => 'field_5db38343d47fe',
				'message' => 'field_5db382a7cbb0f',
			];

			foreach ($acceptable_fields as $field_key => $acf_key) {
				if (!empty($input[$field_key])) {
					$sanitized_data[$field_key] = sanitize_text_field($input[$field_key]);
				} else {
					$errors[] = $field_key . ' was not filled out.';
				}
			}

			if (!empty($errors)) return [
				'success' => false,
				'data' => $errors
			];

			$form_submission = wp_insert_post([
				'post_type' => 'form_submission',
				'post_title' => $sanitized_data['firstName'] . ' ' . $sanitized_data['lastName'],
			], true);

			if (is_wp_error($form_submission)) return [
				'success' => false,
				'data' => $form_submission->get_error_message()
			];

			foreach ($acceptable_fields as $field_key => $acf_key) {
				update_field($acf_key, $sanitized_data[$field_key], $form_submission);
			}

			return [
				'success' => true,
				'data' => json_encode($sanitized_data)
			];

		}
	]);

});
